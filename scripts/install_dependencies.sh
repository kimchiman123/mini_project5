#!/bin/bash
set -e

echo "=== Installing/Updating Dependencies ==="

# 1. Docker Buildx 플러그인 설치 (Root 권한 필요)
# 최신 버전 다운로드 경로 확인 필요. 여기서는 v0.17.1 기준 예시 사용하거나, yum update 시도
# Amazon Linux 2023은 yum install docker-buildx-plugin 사용 가능

echo "Buildx plugin installation..."

# 플러그인 디렉토리 생성
mkdir -p /usr/local/lib/docker/cli-plugins

# buildx 바이너리 다운로드 (v0.17.1)
# architecture 확인
ARCH=$(uname -m)
if [ "$ARCH" == "x86_64" ]; then
  ARCH="amd64"
elif [ "$ARCH" == "aarch64" ]; then
  ARCH="arm64"
fi

BUILDX_VERSION="v0.17.1"
URL="https://github.com/docker/buildx/releases/download/${BUILDX_VERSION}/buildx-${BUILDX_VERSION}.linux-${ARCH}"

echo "Downloading buildx from $URL"
curl -L -o /usr/local/lib/docker/cli-plugins/docker-buildx $URL

# 실행 권한 부여
chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx

echo "Docker Buildx installed successfully."
docker buildx version

# Docker Compose 플러그인 확인 (선택)
echo "Checking Docker Compose version..."
docker compose version || echo "Docker Compose not found or outdated"
