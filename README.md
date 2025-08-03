## About The Project

![MyPerseverance][product-screenshot]

MyPerseverance is a productivity and self-growth tracker that helps users log their daily tasks, visualize their consistency using a heatmap calendar, and build better habits through small, repeatable actions. Inspired by apps like LeetCode and GitHub's contribution graph, it encourages users to stay accountable by tracking real progress—one step at a time.

### Built With

This project is built with a modern, decoupled architecture and is fully containerized for easy setup and deployment.

* [![React][React.js]][React-url]
* [![TailwindCSS][TailwindCSS-badge]][TailwindCSS-url]
* [![Spring Boot][SpringBoot-badge]][SpringBoot-url]
* [![PostgreSQL][PostgreSQL-badge]][PostgreSQL-url]
* [![Docker][Docker-badge]][Docker-url]

---
<!-- GETTING STARTED -->

## Getting Started

This project uses **Docker** to create a consistent and easy-to-run development environment. The following steps will get a local copy of the entire full-stack application up and running with a single command.

### Prerequisites

You only need to have these two tools installed on your system:

* [Git](https://git-scm.com/downloads)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (which includes Docker Compose)

**That's it!** You do not need to install Java, Node.js, or PostgreSQL on your machine manually—Docker handles everything.

### Installation & Setup

Follow these simple steps to set up and run the entire project.

1.  **Clone the Repo**
    ```sh
    git clone [https://github.com/junlongling/myperseverance.git](https://github.com/junlongling/myperseverance.git)
    cd myperseverance
    ```

2.  **Configure Environment Variables**
    This project uses separate `.env` files for backend and frontend configuration. Example files are provided in the repository to make this easy.

    * **Backend Configuration:** From the `backend/` directory, copy the example `.env` file. This file configures both the database and the backend.
      ```sh
      cp backend/.env.example backend/.env
      ```
      *(Note: The default values in the example file are ready for local development. You do not need to change anything).*

    * **Frontend Configuration:** Copy the example `.env` file for the frontend.
      ```sh
      cp frontend/.env.example frontend/.env
      ```
      *(Note: This file tells the frontend where to find the backend API, which is pre-configured for this Docker setup).*

3.  **Build and Run the Application**
    With Docker, you can start the entire application stack (frontend, backend, and database) with a single command. This command should be run from the **project root directory** and uses the `docker-compose.yml` file to orchestrate all services.

    ```sh
    docker-compose up --build
    ```
    * This command might take a few minutes the first time you run it, as it needs to download the necessary base images and build your application.
    * `--build` ensures that fresh Docker images are created for the frontend and backend. The database setup is handled automatically.

4.  **Access the Application**
    Once the containers are up and running, your application will be available at:

    * **Frontend App:** [http://localhost:5173](http://localhost:5173)
    * **Backend API:** `http://localhost:8080`

---
### Development Workflow

* **Hot-Reloading:** This setup is configured for hot-reloading. Any changes you make to the frontend or backend source code will automatically be detected, and the relevant service will restart or refresh in your browser.
* **Stopping the Application:** To stop all running services, press `Ctrl + C` in the terminal where `docker-compose` is running.
* **Running in the Background:** To run the services in the background (detached mode), use:
    ```sh
    docker-compose up -d
    ```
* **Viewing Logs:** To view the logs from the running services (especially in detached mode), use:
    ```sh
    docker-compose logs -f
    ```
* **Stopping Detached Services:**
    ```sh
    docker-compose down
    ```

---
### Running in Hybrid Mode (IDE + Docker)
For intensive backend debugging, you can run the backend directly from your IDE.

1.  **Start Background Services:** In your terminal, run `docker-compose up -d db`.
2.  **Configure IDE:** In your IDE's Run Configuration for the Spring Boot app, use the **EnvFile plugin** to point to the `backend/.env` file.
3.  **Run Backend from IDE:** Start your application. The default `local` profile will be used.
4.  **Run Frontend Dev Server:** In a separate terminal, run `cd frontend && npm run dev`.

<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: images/my.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCSS-badge]: https://img.shields.io/badge/TailwindCSS-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[SpringBoot-badge]: https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white
[SpringBoot-url]: https://spring.io/projects/spring-boot
[PostgreSQL-badge]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Docker-badge]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
