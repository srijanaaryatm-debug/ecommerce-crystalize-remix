# Fullstack Secure App (HTTPS + SMTP)
Run fully secure stack with Traefik + Let's Encrypt + real SMTP for password reset.

## Quick Start
1. Configure backend/.env (see .env.example)
2. Run with HTTPS + Let's Encrypt:
   docker compose -f docker-compose.traefik.yml up --build
3. Open: https://yourdomain.com

## Local (HTTP)
   docker compose up --build
