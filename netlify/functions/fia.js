exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método no permitido' }) };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const message = String(payload.message || '').trim();
    if (!message || message.length > 2000) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Consulta no válida' }) };
    }

    const webhookUrl = process.env.MAKE_FIA_WEBHOOK_URL;
    if (!webhookUrl) throw new Error('MAKE_FIA_WEBHOOK_URL no está configurada');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'web',
        message,
        sessionId: String(payload.sessionId || ''),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const raw = await response.text();
    if (!response.ok) throw new Error('Make devolvió un error');

    let reply = raw;
    try {
      const parsed = JSON.parse(raw);
      reply = parsed.reply || parsed.result || parsed.message || raw;
    } catch {}

    return { statusCode: 200, headers, body: JSON.stringify({ reply: String(reply).trim() }) };
  } catch (error) {
    console.error('Error en FIA:', error);
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'FIA no está disponible temporalmente' }) };
  }
};
