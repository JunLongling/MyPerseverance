package com.myperseverance;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection; // Import this!
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(properties = {
		"client.origin.url=http://localhost:3000",
		// We can add this property to address the JPA warning in the logs
		"spring.jpa.open-in-view=false"
})
@Testcontainers // Keep this annotation
class MyperseveranceApplicationTests {

	@Container
	@ServiceConnection // This is the key change!
	@SuppressWarnings("resource") // Suppress resource leak warning - container is managed by Testcontainers
	static PostgreSQLContainer<?> postgresqlContainer = new PostgreSQLContainer<>("postgres:16")
			.withDatabaseName("test-db")
			.withUsername("testuser")
			.withPassword("testpass");

	// NO LONGER NEEDED! You can delete the entire @DynamicPropertySource method.
	// @ServiceConnection automatically configures the datasource URL, username, password, and JDBC driver.

	@Test
	void contextLoads() {
		// Your test remains the same.
	}
}