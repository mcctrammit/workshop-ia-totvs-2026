// Vercel serverless function -> Google Apps Script -> Gmail.
// The private FORM_TOKEN must exist only in Vercel and Apps Script properties.
const TALKS = Object.freeze({
  '1': 'A nova fase da IA — Eduardo Jacometti',
  '2': 'Agentes de IA para Protheus — Jonathan Formigari',
  '3': 'IA para Negociação — André Neublum Balistrieri',
  '4': 'TOTVS Cloud: a infraestrutura que habilita a nova era da IA — Rafael Freitas',
  '5': 'Sugestões e próximos passos — TOTVS Paulista',
});

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwzGCfsPOIEYvuAhY5ZkstnZAXBF4eu7V2MhEfjWIEuMN8W89RF2abBkEr7R3VqPJrk4w/exec';

const validText = (s, min, max) => typeof s === 'string' && s.trim().length >= min && s.trim().length <= max;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Método não permitido.' });
  }

  const token = process.env.FORM_TOKEN;
  if (!token) {
    return res.status(503).json({ ok: false, message: 'O formulário ainda está em configuração. Tente novamente mais tarde.' });
  }

  const b = typeof req.body === 'string'
    ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })()
    : (req.body || {});

  if (b.website) return res.status(200).json({ ok: true }); // honeypot / spam trap

  const talkId = String(b.talk || '');
  const talk = TALKS[talkId];
  const suggestions = typeof b.suggestions === 'string' ? b.suggestions.trim() : '';

  const invalid = (
    !talk ||
    !validText(b.name, 2, 120) ||
    !validText(b.company, 2, 150) ||
    typeof b.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) || b.email.length > 190 ||
    typeof b.phone !== 'string' || b.phone.replace(/\D/g, '').length < 10 || b.phone.replace(/\D/g, '').length > 13 ||
    b.consent !== true ||
    (talkId === '5' && suggestions.length < 5) ||
    suggestions.length > 1000
  );

  if (invalid) {
    return res.status(400).json({ ok: false, message: 'Confira os campos e a autorização de contato.' });
  }

  const digits = b.phone.replace(/\D/g, '');
  const celular = digits.startsWith('55') ? '+' + digits : '+55' + digits;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const upstream = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        token,
        nome: b.name.trim(),
        email: b.email.trim().toLowerCase(),
        celular,
        empresa: b.company.trim(),
        palestra: talkId,
        produto_interesse: talk,
        sugestoes: suggestions,
      }),
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!upstream.ok) {
      console.error('Apps Script returned HTTP', upstream.status);
      return res.status(502).json({ ok: false, message: 'Não foi possível enviar sua solicitação agora. Tente novamente.' });
    }

    const output = await upstream.json().catch(() => null);
    if (output?.ok !== true) {
      console.error('Apps Script did not confirm delivery');
      return res.status(502).json({ ok: false, message: 'O envio não foi confirmado. Verifique a configuração e tente novamente.' });
    }

    return res.status(200).json({ ok: true, message: 'Solicitação enviada com sucesso.' });
  } catch (err) {
    console.error('Apps Script request failed:', err?.name || err);
    return res.status(502).json({ ok: false, message: 'Falha de comunicação. Tente novamente.' });
  } finally {
    clearTimeout(timeout);
  }
}
