"""
VERA AI Model Service - FastAPI
Loads fine-tuned VERA model and exposes chat endpoint
"""

import logging
import os
import time
from contextlib import asynccontextmanager
from typing import List, Optional

import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from prometheus_client import Counter, Histogram, generate_latest
from unsloth import FastLanguageModel

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

model = None
tokenizer = None

chat_requests = Counter("vera_chat_requests_total", "Total chat requests")
chat_duration = Histogram("vera_chat_duration_seconds", "Chat request duration")
chat_errors = Counter("vera_chat_errors_total", "Total chat errors")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model on startup, cleanup on shutdown."""
    global model, tokenizer

    logger.info("Loading VERA model...")
    try:
        model_path = os.getenv("VERA_MODEL_PATH", "./vera_trained_model")

        model, tokenizer = FastLanguageModel.from_pretrained(
            model_name=model_path,
            max_seq_length=2048,
            dtype=None,
            load_in_4bit=True,
        )

        FastLanguageModel.for_inference(model)
        logger.info("VERA model loaded successfully")
    except Exception as exc:  # pylint: disable=broad-except
        logger.error("Failed to load model: %s", exc)
        raise

    yield

    logger.info("Shutting down VERA service...")
    if model is not None:
        del model
    if tokenizer is not None:
        del tokenizer
    if torch.cuda.is_available():
        torch.cuda.empty_cache()


app = FastAPI(
    title="VERA AI Service",
    description="Nervous system regulation AI coregulator",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    max_tokens: Optional[int] = 512
    temperature: Optional[float] = 0.7


class ChatResponse(BaseModel):
    message: str
    tokens_used: int


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "gpu_available": torch.cuda.is_available(),
    }


@app.get("/metrics")
async def metrics():
    """Expose Prometheus metrics."""
    return Response(generate_latest(), media_type="text/plain")


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process chat message and return VERA's response."""
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    chat_requests.inc()
    start_time = time.perf_counter()

    try:
        conversation = ""
        for msg in request.messages:
            if msg.role == "user":
                conversation += f"### Instruction:\n{msg.content}\n\n### Response:\n"
            elif msg.role == "assistant":
                conversation += f"{msg.content}\n\n"

        device = "cuda" if torch.cuda.is_available() else "cpu"
        inputs = tokenizer(
            [conversation],
            return_tensors="pt",
            truncation=True,
            max_length=2048,
        ).to(device)

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=request.max_tokens,
                temperature=request.temperature,
                use_cache=True,
                do_sample=True,
                top_p=0.9,
                repetition_penalty=1.1,
            )

        full_response = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]

        if "### Response:" in full_response:
            vera_response = full_response.split("### Response:")[-1].strip()
        else:
            vera_response = full_response.strip()

        vera_response = vera_response.replace("<|endoftext|>", "").strip()

        elapsed = time.perf_counter() - start_time
        chat_duration.observe(elapsed)

        logger.info("Generated response (%d chars)", len(vera_response))

        return ChatResponse(
            message=vera_response,
            tokens_used=len(outputs[0]),
        )
    except Exception as exc:  # pylint: disable=broad-except
        chat_errors.inc()
        logger.error("Error generating response: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/")
async def root():
    """Root endpoint returning service metadata."""
    return {
        "service": "VERA AI Model Service",
        "status": "running",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENV") == "development",
    )
