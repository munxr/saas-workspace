# SaaS Workspace Platform 

A secure, decoupled full-stack Software as a Service (SaaS) application featuring a React user interface, a robust Java Spring Boot REST API, and a cloud-hosted relational MySQL database. 

This architecture transitions a local application into a production-ready cloud ecosystem handling automated continuous deployment (CI/CD), cross-origin security rules, and managed cloud infrastructure.

 **Live Application URL:** [https://saas-workspace-seven.vercel.app/](https://saas-workspace-seven.vercel.app/)  

---

## Tech Stack

### Frontend
* **Framework:** React JS (via Vite)
* **HTTP Client:** Axios (Configured with dynamic production Base URLs and interceptors)
* **Deployment:** Vercel (Served via a global Edge Network)

### Backend
* **Core Engine:** Java 17 / Spring Boot
* **Security Framework:** Spring Security + JSON Web Tokens (JWT)
* **Data Access:** Spring Data JPA / Hibernate
* **Connection Pooling:** HikariCP
* **Deployment:** Render (Containerized multi-stage Docker builds)

### Database
* **Engine:** MySQL 8.4
* **Hosting:** Aiven (Cloud-managed database cluster)

---

## Key Features & Architecture Highlights

* **Decoupled Architecture:** Completely separated client and server applications communicating asynchronously over a RESTful API.
* **Secure Authentication Pipeline:** Complete user registration and login flows protected by Spring Security. Plain-text passwords are securely hashed before persistence using the **BCrypt Password Encoder**.
* **Highest-Precedence CORS Management:** Implemented custom global filters at the maximum priority level within the server engine to handle cross-origin browser preflight (`OPTIONS`) checks between the Vercel frontend and Render backend.
* **Automated CI/CD Workflows:** Configured automated webhooks connecting GitHub to Vercel and Render for frictionless zero-downtime integration pipelines upon pushing to the `main` branch.
* **High Availability Infrastructure:** Solved cloud free-tier compute idle restrictions and database auto-shutdown schedules by engineering a custom `/api/health` micro-checkpoint coupled with an automated external execution heartbeat. The ecosystem remains warm, responsive, and available 24/7.

---

## System Data Flow

1.  **Client Tier:** User actions trigger an optimized production build on Vercel to route a secure network payload downstream.
2.  **Security Filtering:** Incoming traffic is verified by explicit CORS source validation and checked against stateless JWT verification gates.
3.  **Application Processing:** Valid paths execute specialized logic within the Spring Controller layer, managing object mappings and credential encryption rules.
4.  **Persistence Layer:** Transactions are fed to an actively pooled connection grid pointing directly to the managed MySQL infrastructure on Aiven.

---

## Local Development Setup

To replicate this project environment locally, follow these execution steps:

### Prerequisites
* Java Development Kit (JDK) 17 or higher
* Node.js (v18+) & npm
* MySQL Server running locally

### 1. Clone the Workspace
```bash
git clone [https://github.com/munxr/saas-workspace.git](https://github.com/munxr/saas-workspace.git)
cd saas-workspace
```

### 2. Backend Configuration
Navigate to the backend codebase and configure your environment variables inside `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_local_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

Run the Spring Boot application using your favorite IDE or via the terminal:
```bash
cd workspace
./mvnw spring-boot:run
```

### 3. Frontend Configuration
Navigate to the frontend folder, install the required dependencies, and launch the development server:

```bash
cd frontend
npm install
npm run dev
```
The application interface will now be accessible locally at `http://localhost:5173`.

---

## 📝 Author
Developed and maintained by **Abdul Muneer**.
