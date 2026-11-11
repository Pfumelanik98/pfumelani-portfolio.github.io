# Pfumelani Rikhotso — React Portfolio

React + Vite frontend for the Django REST Framework portfolio API.

## Local development

1. Install Node.js 20 or newer.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`.
4. Set `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1`.
5. Start the Django backend, then run `npm run dev`.
6. Open the Vite URL shown in the terminal.

The frontend reads profile, skills, education, projects and certificates from the API. Public contact details are maintained in the React app and shown on its Contact page. Empty states are shown until API content is published in Django.

## Deployment

Set `VITE_API_BASE_URL` to the deployed HTTPS Django API base URL before building. The Django deployment must allow the exact frontend origin in `CORS_ALLOWED_ORIGINS`. The local loopback API address is for local development only.

The CV is intentionally not linked or included in this React application. Review the existing public PDF in the repository separately before making the repository public again.
