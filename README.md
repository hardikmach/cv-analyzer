# CV Analyzer

AI-powered resume analysis and interview preparation with a React/Vite frontend and Express API.

## Run locally

Prerequisites: Node.js 22+ and a Gemini API key.

```bash
npm install
copy .env.example .env
npm run dev
```

Set `GEMINI_API_KEY` in `.env`. In production also set `APP_ORIGIN` to the exact public HTTPS origin and provide `PORT` from the hosting platform.

## Production deployment

```bash
npm run build
NODE_ENV=production APP_ORIGIN=https://your-domain.example GEMINI_API_KEY=... npm start
```

Or build the included container with `docker build -t cv-analyzer .` and run it with the secrets supplied at runtime, never baked into the image.

The server includes security headers, same-origin API checks, JSON-only mutations, request-size limits, rate limiting, timeouts, a `/healthz` probe, and production-safe error responses. Keep the API key server-side and terminate TLS at the platform or reverse proxy.
