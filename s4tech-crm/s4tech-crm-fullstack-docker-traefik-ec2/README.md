# S4Tech CRM — Fullstack Starter

Features included:
- React + Vite client (Tailwind, Recharts)
- Theme switcher (light/dark) and default blue-cyan gradient branding
- Auth provider layer with examples for Clerk, Firebase, NextAuth and a dev fake provider (select via VITE_AUTH_PROVIDER env var)
- Express + SQLite server in /server with seeded demo data and simple RBAC middleware
- Docker Compose for local fullstack dev
- GitHub Actions workflows for build & deploy

Quick start:
1. Copy `.env.example` -> `.env` and set values (or use defaults for local dev)
2. Run `npm install` at project root, then `npm run dev`

The client runs on port 5173, the server on port 4000 by default.


## Docker-based self-host deploy
See `docs/deploy-docker.md` for a step-by-step guide to deploy with Docker Compose on a VPS or EC2 instance.


## Docker secrets & Traefik (production)

This project includes a `docker-compose.traefik.prod.yml` configuration that uses **Traefik v3** as a reverse proxy and automates Let's Encrypt certificates.
It also supports Docker-native secrets with `docker-compose.prod.secrets.yml`.

### Secrets
- Place your base64-encoded Firebase service account JSON in `secrets/firebase_service_account.b64` (create the `secrets` directory).
- To deploy with Docker-native secrets, run:
  ```bash
  docker compose -f docker-compose.traefik.prod.yml -f docker-compose.prod.secrets.yml up -d --build
  ```

### Traefik environment variables
Set the following env vars (in your shell or on the server):
- `DOMAIN` - your root domain (e.g., example.com)
- `LETSENCRYPT_EMAIL` - email address used by Let's Encrypt

Traefik will provision certificates for `DOMAIN` and `api.DOMAIN` automatically.


## Automated EC2 deploy script
A helper script `scripts/deploy-ec2.sh` is included to create an Ubuntu EC2 instance, install Docker, copy the project, and start the stack.

Usage example:
```
./scripts/deploy-ec2.sh --key-name my-aws-key --region us-east-1 --domain example.com --ssh-user ubuntu
```

Make sure you have AWS CLI configured (`aws configure`) and the key pair exists in the specified region.

The script uploads the project archive and runs `docker compose -f docker-compose.traefik.prod.yml -f docker-compose.prod.secrets.yml up -d --build` on the instance.
