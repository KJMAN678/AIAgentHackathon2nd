docker compose -f docker-compose.local.yaml down
docker compose -f docker-compose.local.yaml build
docker compose -f docker-compose.local.yaml up -d
docker builder prune -f
