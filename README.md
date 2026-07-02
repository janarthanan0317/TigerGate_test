# TigerGate Security Playground

This is a small, educational Node.js project designed to test code security platforms such as **TigerGate**. It contains intentional vulnerabilities in multiple categories: SAST (Static Application Security Testing), SCA (Software Composition Analysis), Secrets Scanning, and IaC (Infrastructure as Code) scanning. It also includes configuration files to generate a Software Bill of Materials (SBOM).

> [!WARNING]
> **This repository is intentionally insecure.** It should only be used for learning, training, or testing security scanners. Do not deploy this application to production.

---

## Project Structure

```
project/
├── app.js               # Express application entrypoint
├── routes/
│   └── api.js           # API Endpoints (contains SQLi, Command Injection, hardcoded PAT)
├── package.json         # Dependency configuration (contains vulnerable dependencies)
├── package-lock.json    # Locked dependencies (for SCA and SBOM scanning)
├── Dockerfile           # Docker configuration
├── terraform/
│   ├── main.tf          # IaC resources (contains insecure SG and public S3 bucket)
│   └── variables.tf     # Terraform variables
├── config/
│   └── aws.js           # Configuration with hardcoded AWS keys
├── .env.example         # Sample environment file
└── README.md            # Project documentation
```

---

## Running the Application

### Locally (Node.js)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the application:
   ```bash
   npm start
   ```
3. Access the server at `http://localhost:3000`.

### Using Docker

1. Build the Docker image:
   ```bash
   docker build -t tigergate-playground .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 tigergate-playground
   ```
3. Access the server at `http://localhost:3000`.

---

## API Endpoints & Testing Vulnerabilities

### 1. SQL Injection (SAST)
* **Endpoint**: `POST /api/login`
* **Vulnerable Code**: Raw user input is concatenated into the SQL statement:
  ```javascript
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  ```
* **How to exploit / test**:
  Send a payload that bypasses authentication, e.g.:
  ```bash
  curl -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{"username": "admin'\'' OR '\''1'\''='\''1", "password": "any"}'
  ```

### 2. Command Injection (SAST)
* **Endpoint**: `GET /api/ping`
* **Vulnerable Code**: Unsanitized query parameters are executed directly in the shell:
  ```javascript
  const command = `ping -c 1 ${host}`;
  exec(command, ...)
  ```
* **How to exploit / test**:
  Inject a command separator to run arbitrary commands (e.g., `; ls -la`):
  ```bash
  curl "http://localhost:3000/api/ping?host=127.0.0.1;%20ls%20-la"
  ```
