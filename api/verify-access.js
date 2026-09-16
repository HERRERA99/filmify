import crypto from 'node:crypto';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

function isSameCode(received, expected) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({message: 'Método no permitido.'});
  }

  const configuredCode = process.env.FILMIFY_ACCESS_CODE;
  if (!configuredCode) {
    return res.status(503).json({message: 'El acceso todavía no está configurado.'});
  }

  const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
  if (!code || !isSameCode(code, configuredCode)) {
    return res.status(401).json({message: 'El código de acceso no es válido.'});
  }

  return res.status(200).json({expiresAt: Date.now() + SESSION_DURATION_MS});
}
