plugins {
    id("org.springframework.boot")
}

dependencies {
    implementation(project(":core-common"))
    implementation(project(":module-union"))
    implementation(project(":module-dataware"))

    implementation("io.jsonwebtoken:jjwt-api:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.5")
}
