export async function sendMessageToVera(conversationId: string, message: string): Promise<string> {
  const response = await fetch('/api/vera/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      conversationId,
      message
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get VERA response');
  }

  const data = await response.json();
  return data.message as string;
}
