# 빌드는 CodeBuild(buildspec.yml)에서 이미 수행됨
# Docker Hub Rate Limit 회피를 위해 Public ECR 사용
FROM public.ecr.aws/amazoncorretto/amazoncorretto:17-al2-jdk


WORKDIR /app

# buildspec에서 ./gradlew build 실행 후 생성된 JAR 파일을 복사
COPY build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]


