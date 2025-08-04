# Stage 1: Build the JAR using an official Maven image that includes JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app


COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the source code
COPY src ./src

# Build the application (the -DskipTests flag is good practice for Docker builds)
RUN mvn clean package -DskipTests

# Stage 2: Create the final, smaller runtime image
FROM eclipse-temurin:21
WORKDIR /opt/app

# Copy only the built JAR file from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]