FROM openjdk:21
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests
CMD ["java", "-jar", "target/myperseverance-0.0.1-SNAPSHOT.jar"]
