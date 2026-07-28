# ---- Stage 1: Build ----
FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app

# Gradle wrapper & config (캐시 활용)
COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle

# 모듈별 build 파일
COPY core-common/build.gradle.kts core-common/
COPY module-union/build.gradle.kts module-union/
COPY module-dataware/build.gradle.kts module-dataware/
COPY module-admin/build.gradle.kts module-admin/

# 의존성 미리 다운로드 (레이어 캐시)
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon || true

# 소스 복사 & 빌드
COPY . .
RUN ./gradlew :module-admin:bootJar --no-daemon -x test

# ---- Stage 2: Runtime ----
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=builder /app/module-admin/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
