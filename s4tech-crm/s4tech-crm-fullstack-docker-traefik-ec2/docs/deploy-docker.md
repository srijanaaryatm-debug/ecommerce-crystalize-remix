# Deploying S4Tech CRM with Docker (VPS / AWS EC2)

This guide shows a minimal path to deploy the S4Tech CRM fullstack app using Docker and Docker Compose on a Linux VPS or AWS EC2 instance.

## Assumptions
- You have a Linux server (Ubuntu 22.04+ recommended) with Docker & Docker Compose installed.
- You control DNS for your domain and can create A records.
- You will provide SSL certificates (Let's Encrypt recommended) and place them in `nginx/certs` as `fullchain.pem` and `privkey.pem`.

## Steps (summary)
1. SSH into your server.
2. Install Docker & Docker Compose (or use the packaged `docker-compose`).
3. Clone this repository to `/opt/s4tech-crm` (or wherever you prefer).
4. Copy `.env.example` -> `.env` and set values (especially `FIREBASE_SERVICE_ACCOUNT_B64`).
5. Build images and start services:
   ```bash
   docker compose -f docker-compose.prod.yml build
   docker compose -f docker-compose.prod.yml up -d
   ```
6. Ensure `nginx` is running and proxying. Place your certs in `nginx/certs/`.
7. For automatic TLS with Let's Encrypt, you can use `certbot` to obtain certs and place them into `nginx/certs` (outside the scope of this doc).

## Persisting data
- Server SQLite DB is persisted to `./server/data/dev.sqlite` via a bind mount. Back this file up regularly.

## Updating / Rolling deploy
- Pull new code, rebuild images, and bring up services:
  ```bash
  git pull origin main
  docker compose -f docker-compose.prod.yml build
  docker compose -f docker-compose.prod.yml up -d
  ```

## Systemd unit (optional)
Create `/etc/systemd/system/s4tech-crm.service`:
```ini
[Unit]
Description=S4Tech CRM - Docker Compose
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
WorkingDirectory=/opt/s4tech-crm
ExecStart=/usr/bin/docker compose -f /opt/s4tech-crm/docker-compose.prod.yml up -d --build
ExecStop=/usr/bin/docker compose -f /opt/s4tech-crm/docker-compose.prod.yml down
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

Enable & start:
```bash
sudo systemctl enable s4tech-crm
sudo systemctl start s4tech-crm
```

## Notes & Security
- Provide a secure `FIREBASE_SERVICE_ACCOUNT_B64` as an environment variable (or use Docker secrets).
- For production, consider replacing SQLite with PostgreSQL and moving server state to a proper RDS instance.
- Use a reverse proxy or load balancer if you plan to horizontally scale the server.
