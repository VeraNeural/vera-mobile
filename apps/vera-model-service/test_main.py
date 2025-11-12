import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_chat_requires_model(client):
    response = client.post(
        "/chat",
        json={
            "messages": [{"role": "user", "content": "I feel anxious"}],
            "max_tokens": 64,
        },
    )
    assert response.status_code in (200, 503)
