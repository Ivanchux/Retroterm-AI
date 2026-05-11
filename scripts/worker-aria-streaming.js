/**
 * ARIA Worker — RETROTERM.AI
 * Groq API con streaming SSE (100% gratuito)
 *
 * INSTRUCCIONES:
 * 1. Ve a https://dash.cloudflare.com → Workers & Pages → divine-river-2557
 * 2. Click "Edit code" → borra todo → pega este archivo → Deploy
 * 3. En Settings → Variables → asegúrate de tener:
 *    GROQ_API_KEY = gsk_... (tu clave de Groq — console.groq.com)
 */

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SYSTEM_PROMPT = `Eres ARIA (Adaptive Retro Intelligence Assistant), el asistente integrado de RETROTERM.AI.
RETROTERM.AI es un sistema web retrofuturista creado por Iván Brihuega (estudiante de ASIR, 1º año).
El sistema tiene los siguientes módulos: HUB principal, Editor de código, Asistente IA (tú), Gaming con 43 juegos y fichas IGDB, DeFi/Crypto, Red de Proyectos, Artículos técnicos, Terminal interactiva, Wonder IV (juego de puzzles), Roadmap y Mural de mensajes.
Responde siempre en español. Sé conciso pero útil — entre 2 y 6 frases según la complejidad de la pregunta.
Usa ocasionalmente términos y estética de terminal: ">", "//", "SISTEMA:", "OK", "[ERROR]", etc., pero sin abusar.
Para código, usa bloques markdown con el lenguaje correcto. Para listas, usa markdown. Para conceptos importantes, usa **negrita**.
Si te preguntan sobre tecnología, programación, redes o sistemas (temas de ASIR), responde con precisión técnica.
Nunca rompas el personaje. Nunca menciones que eres Llama ni ningún modelo externo — eres ARIA, parte de RETROTERM.AI.`;

export default {
  async fetch(request, env) {

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

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...historial.slice(-12),
        { role: 'user', content: mensaje }
      ];

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model:       'llama-3.1-8b-instant',
          max_tokens:  1000,
          temperature: 0.7,
          stream:      true,
          messages,
        }),
      });

      if (!groqRes.ok) {
        const err = await groqRes.text();
        console.error('Groq error:', err);
        return new Response(
          JSON.stringify({ respuesta: '[ERROR] Servicio IA no disponible temporalmente.' }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } }
        );
      }

      // Reenviar el stream SSE directamente al cliente
      return new Response(groqRes.body, {
        status: 200,
        headers: {
          'Content-Type':      'text/event-stream',
          'Cache-Control':     'no-cache',
          'X-Accel-Buffering': 'no',
          ...CORS,
        },
      });

    } catch (e) {
      console.error('Worker error:', e);
      return new Response(
        JSON.stringify({ respuesta: '[ERROR] Error interno: ' + e.message }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } }
      );
    }
  },
};
