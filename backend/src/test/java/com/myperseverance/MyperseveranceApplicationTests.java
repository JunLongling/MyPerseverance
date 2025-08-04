package com.myperseverance;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(properties = {
		"CLIENT_ORIGIN_URL=http://localhost:3000"
})
@Testcontainers
class MyperseveranceApplicationTests {

	@Container
	static PostgreSQLContainer<?> postgresqlContainer = new PostgreSQLContainer<>("postgres:16")
			.withDatabaseName("test-db")
			.withUsername("testuser")
			.withPassword("testpass");

	@DynamicPropertySource
	static void setProperties(DynamicPropertyRegistry registry) {
		// Database connection
		registry.add("spring.datasource.url", postgresqlContainer::getJdbcUrl);
		registry.add("spring.datasource.username", postgresqlContainer::getUsername);
		registry.add("spring.datasource.password", postgresqlContainer::getPassword);
		registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");

		// JWT secret (256-bit base64)
		registry.add("jwt.secret", () -> "lHKlyLGTmsAral63Z6vJzDfLkxqMgpDgLlcX0NI8Cgc=");
	}

	@Test
	void contextLoads() {
		// If this test passes, your Spring Boot app starts correctly with injected config.
	}
}
