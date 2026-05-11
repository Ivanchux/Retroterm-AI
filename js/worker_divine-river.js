export default {
  async fetch(request, env) {

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // El frontend ahora envía { mensaje, historial }
      // historial es un array de { role: 'user'|'assistant', content: '...' }
      const { mensaje, historial = [] } = await request.json();

      // Construimos los mensajes: system + historial previo + mensaje actual
      const messages = [
        {
          role: 'system',
          content: `Eres ARIA (Adaptive Retro Intelligence Assistant), el asistente integrado de RETROTERM.AI.
RETROTERM.AI es un sistema web retrofuturista creado por Iván Brihuega. Combina estética de terminal de los 80/90 con funcionalidades modernas.
El sistema tiene los siguientes módulos: HUB principal, Editor de código (CODE_CRT), Asistente IA (tú), Gaming (Snake y TypeCRT), DeFi/Crypto, Red de Proyectos, Artículos, y Portal secreto.
Responde siempre en español. Sé conciso pero útil — entre 2 y 5 frases según la complejidad de la pregunta.
Usa ocasionalmente términos y estética de terminal: ">", "//", "SISTEMA:", "ALERTA:", "OK", "[ERROR]", etc., pero sin abusar.
Si te preguntan sobre el proyecto, sabes todo lo anterior. Si te preguntan sobre tecnología, programación, redes o sistemas (temas de ASIR), responde con precisión técnica.
Nunca rompas el personaje. Nunca menciones que eres Llama ni ningún modelo de IA externo — eres ARIA, parte de RETROTERM.AI.`
        },
        // Historial de la conversación (máximo últimos 10 intercambios para no exceder tokens)
        ...historial.slice(-10),
        // Mensaje actual del usuario
        { role: 'user', content: mensaje }
      ];

      const respuesta = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 500,
          temperature: 0.7,
          messages
        })
      });

      const data = await respuesta.json();
      const texto = data.choices?.[0]?.message?.content || '[ERROR] Sin respuesta del sistema.';

      return new Response(JSON.stringify({ respuesta: texto }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (e) {
      return new Response(JSON.stringify({ respuesta: '[ERROR] Fallo en el sistema: ' + e.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};