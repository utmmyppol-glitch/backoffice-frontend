set -eu

NETWORK="union-net"
ALIAS="backoffice-active"
IMAGE="${DOCKER_IMAGE:?DOCKER_IMAGE not set}"

# 네트워크 없으면 최초 1회 생성
docker network create "$NETWORK" >/dev/null 2>&1 || true

if docker ps --format '{{.Names}}' | grep -qx backoffice-blue; then
  CURRENT=backoffice-blue
  NEW=backoffice-green
else
  CURRENT=backoffice-green
  NEW=backoffice-blue
fi

echo "==> Using locally built image $IMAGE"
docker image inspect "$IMAGE" >/dev/null 2>&1 || {
  echo "ERROR: 이미지 $IMAGE 가 로컬에 없습니다. docker stage가 먼저 빌드했는지 확인하세요."
  exit 1
}

docker rm -f "$NEW" >/dev/null 2>&1 || true

echo "==> Starting $NEW on $NETWORK (not yet receiving traffic via $ALIAS)"
docker run -d --name "$NEW" --network "$NETWORK" --restart unless-stopped "$IMAGE"

echo "==> Health checking $NEW"
OK=0
i=0
while [ "$i" -lt 15 ]; do
  if docker run --rm --network "$NETWORK" curlimages/curl:8.10.1 -sf "http://$NEW:3002/" >/dev/null 2>&1; then
    OK=1
    break
  fi
  i=$((i + 1))
  sleep 3
done

if [ "$OK" -ne 1 ]; then
  echo "==> Health check failed for $NEW, rolling back (old container untouched)"
  docker rm -f "$NEW" >/dev/null 2>&1 || true
  exit 1
fi

echo "==> Switching traffic: attaching $NEW alias $ALIAS"
docker network disconnect "$NETWORK" "$NEW"
docker network connect --alias "$ALIAS" --alias "$NEW" "$NETWORK" "$NEW"

sleep 2

if docker ps -a --format '{{.Names}}' | grep -qx "$CURRENT"; then
  echo "==> Removing old container $CURRENT"
  docker network disconnect "$NETWORK" "$CURRENT" >/dev/null 2>&1 || true
  docker rm -f "$CURRENT" >/dev/null 2>&1 || true
fi

echo "==> Deploy complete. Active: $NEW"
