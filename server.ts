// ============================================================
// server.ts
// Express 5 Backend Gateway for BreatheWay
// Enforces OWASP Top 10, CWE-209 safe error handling,
// SHA-256 LRU cache (100-entries), rate limiting, and server-side AI
// Per SECURITY.md, EFFICIENCY.md, and docs/DECISIONS.md ADR-003
// ============================================================

import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { insightCache, hashPayload, pruneCache } from './server/cache';
import { validateZone, validatePersona, sanitizeText } from './server/validators';
import { helmetMiddleware, corsMiddleware, aiRateLimiter, safeErrorHandler } from './server/middleware';
import { getAiRoutineInsights, getEmergencyAdvisoryText } from './server/aiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// 1. Defensive Middleware Chain
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '15kb' }));

// 2. Health Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    timestamp: Date.now(),
    cacheEntries: insightCache.size,
  });
});

// 3. Routine Insights Endpoint
app.post('/api/routine-insights', aiRateLimiter, async (req: Request, res: Response) => {
  const { persona, zone, language = 'en' } = req.body;
  if (!validateZone(zone)) {
    return res.status(400).json({ error: 'Invalid zone telemetry payload or out-of-range values.' });
  }
  if (!validatePersona(persona)) {
    return res.status(400).json({ error: 'Invalid persona profile payload.' });
  }

  const cleanLang = sanitizeText(language, 10) || 'en';
  const cacheKey = hashPayload({ personaId: persona.id, zoneId: zone.zoneId, aqi: zone.aqi, cleanLang });

  if (insightCache.has(cacheKey)) {
    return res.status(200).json(insightCache.get(cacheKey)!.data);
  }

  const result = await getAiRoutineInsights(persona, zone, cleanLang);
  pruneCache();
  insightCache.set(cacheKey, { data: result, cachedAt: Date.now() });
  return res.status(200).json(result);
});

// 4. Emergency Advisory Endpoint
app.post('/api/emergency-advisory', aiRateLimiter, async (req: Request, res: Response) => {
  const { zone, language = 'en' } = req.body;
  if (!validateZone(zone)) {
    return res.status(400).json({ error: 'Invalid zone telemetry payload.' });
  }

  const cleanLang = sanitizeText(language, 10) || 'en';
  const cacheKey = hashPayload({ type: 'advisory', zoneId: zone.zoneId, aqi: zone.aqi, cleanLang });

  if (insightCache.has(cacheKey)) {
    return res.status(200).json({ advisory: insightCache.get(cacheKey)!.data });
  }

  const advisory = await getEmergencyAdvisoryText(zone, cleanLang);
  pruneCache();
  insightCache.set(cacheKey, { data: advisory, cachedAt: Date.now() });
  return res.status(200).json({ advisory });
});

// 5. Static Assets & Express 5 Named Splat Fallback
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*splat', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('BreatheWay Backend Running. Build frontend with `npm run build` to serve SPA.');
    }
  });
});

// 6. Safe Error Handler
app.use(safeErrorHandler);

// 7. Server Listener
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[BreatheWay] Backend listening on port ${PORT}`);
  });
}

export { insightCache, hashPayload, aiRateLimiter };
