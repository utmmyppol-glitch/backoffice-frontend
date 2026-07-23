plugins {
    `java-library`
}

dependencies {
    api(project(":core-common"))
    implementation("org.springframework.boot:spring-boot-starter-websocket")
}
