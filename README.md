<!-- ABOUT THE PROJECT -->
## About The Project

[![MyPerseverance][product-screenshot]](https://example.com)

MyPerseverance is a productivity and self-growth tracker that helps users log their daily tasks, visualize their consistency using a heatmap calendar, and build better habits through small, repeatable actions. Inspired by apps like leetcode and GitHub's contribution graph, it encourages users to stay accountable by tracking real progress—one step at a time.


### Built With

* [![React][React.js]][React-url]
* [![TailwindCSS][TailwindCSS-badge]][TailwindCSS-url]
* [![Spring Boot][SpringBoot-badge]][SpringBoot-url]
* [![PostgreSQL][PostgreSQL-badge]][PostgreSQL-url]


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

Make sure you have the following installed:

* Node.js (v18 or later)
* npm
* Java 21 (LTS)
* PostgreSQL

### Installation 
1. Clone the repo
   ```sh
   git clone https://github.com/junlongling/myperseverance.git
   cd myperseverance
   ```
2. Configure PostgreSQL and JWT secret  
   Copy the example configuration file to create your own local config:
   ```sh
   cp backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties
   ```
   Then open application.properties and replace the placeholder values with your own credentials:
   ```sh
   spring.datasource.url=jdbc:postgresql://localhost:5432/YOUR_DATABASE_NAME
   spring.datasource.username=YOUR_DB_USERNAME
   spring.datasource.password=YOUR_DB_PASSWORD
   spring.jpa.hibernate.ddl-auto=update
   jwt.secret=YOUR_JWT_SECRET
   ```
3. Run Backend
   ```sh
   cd backend
   ./mvnw spring-boot:run
   ```
4. Setup Frontend
   Navigate to the frontend folder, create a .env file, install dependencies, and run the frontend server:
   ```sh
   cd ../frontend
   ```
   Create a .env file with the following content:
   ```sh
   VITE_API_URL=http://localhost:8080/api
   ```
   Then install dependencies and start the dev server:
   ```sh
   npm install
   npm run dev
   ```
5. Open your browser and visit:
 ```sh
   http://localhost:5173
```

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: images/my.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCSS-badge]: https://img.shields.io/badge/TailwindCSS-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[SpringBoot-badge]: https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white
[SpringBoot-url]: https://spring.io/projects/spring-boot
[PostgreSQL-badge]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
