#!/bin/bash
set -e

# 프로젝트 디렉토리로 이동
cd /home/ec2-user/mini_project5

echo "Starting deployment at $(date)"

# 기존 컨테이너 중지 (에러 무시)
echo "Stopping existing containers..."
docker compose down || true

# 최신 이미지 빌드 및 실행
echo "Building and starting new containers..."
# --no-cache를 주면 매번 새로 빌드하지만 시간이 걸림. 필요시 추가.
docker compose up -d --build

# 확인
echo "Deployment finished. Checking ps..."
docker compose ps