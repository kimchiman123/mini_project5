#!/bin/bash

# 프로젝트 디렉토리로 이동
cd /home/ec2-user/mini_project5

# 기존 컨테이너 중지 및 제거 (볼륨은 유지)
echo "Stopping existing containers..."
docker compose down

# 최신 이미지 빌드 및 실행
echo "Building and starting new containers..."
docker compose up -d --build