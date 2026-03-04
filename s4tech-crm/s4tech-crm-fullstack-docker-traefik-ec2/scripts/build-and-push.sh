#!/usr/bin/env bash
set -e
# Usage: ./scripts/build-and-push.sh <registry> <tag>
REG=${1:-your-registry.example.com}
TAG=${2:-latest}
# build
docker build -t ${REG}/s4tech-crm-client:${TAG} ./client
docker build -t ${REG}/s4tech-crm-server:${TAG} ./server
# push
docker push ${REG}/s4tech-crm-client:${TAG}
docker push ${REG}/s4tech-crm-server:${TAG}
