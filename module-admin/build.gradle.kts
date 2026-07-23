plugins {
    id("org.springframework.boot")
}

dependencies {
    implementation(project(":core-common"))
    implementation(project(":module-union"))
    implementation(project(":module-dataware"))
}
