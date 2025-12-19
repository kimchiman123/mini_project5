# Stage 1: Build the application
FROM gradle:jdk17 AS builder
WORKDIR /home/gradle/src
COPY --chown=gradle:gradle . .
RUN chmod +x gradlew
RUN ./gradlew bootJar -x test --no-daemon

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /home/gradle/src/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

