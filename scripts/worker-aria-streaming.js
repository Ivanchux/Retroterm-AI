/**
 * ARIA Worker — RETROTERM.AI
 * Cloudflare Worker con streaming SSE para Claude API
 *
 * INSTRUCCIONES:
 * 1. Ve a https://dash.cloudflare.com → Workers & Pages → divine-river-2557
 * 2. Click "Edit code" → borra todo → pega este archivo completo → Deploy
 * 3. En Settings → Variables → añade la variable de entorno:
 *    ANTHROPIC_API_KEY = sk-ant-... (tu clave de Anthropic)
 */

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {

    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS });
    }

    try {
      const { mensaje, historial = [] } = await request.json();

      if (!mensaje) {
        return new Response(
          JSON.stringify({ error: 'Campo "mensaje" requerido' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...CORS } }
        );
      }

      // Construir array de mensajes para Claude
      const messages = [
        ...historial,
        { role: 'user', content: mensaje }
      ];

      // Llamada a Claude API con streaming
      const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model:      'claude-3-haiku-20240307',  // rápido y económico
          max_tokens: 1500,
          stream:     true,
          messages,
        }),
      });

      if (!anthropicRes.ok) {
        const err = await anthropicRes.text();
        console.error('Anthropic error:', err);
        return new Response(
          JSON.stringify({ respuesta: '[ERROR] Servicio IA no disponible.' }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } }
        );
      }

      // Reenviar el stream SSE directamente al cliente
      return new Response(anthropicRes.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
          ...CORS,
        },
      });

    } catch (e) {
      console.error('Worker error:', e);
      return new Response(
        JSON.stringify({ respuesta: '[ERROR] Error interno del sistema.' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } }
      );
    }
  },
};
