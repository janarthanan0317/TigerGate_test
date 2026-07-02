const express = require("express");
const apiRouter = require("./routes/api");
const awsConfig = require("./config/aws");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Log AWS config region to verify config import works correctly
console.log(`[Config] AWS components loaded for region: ${awsConfig.region}`);

// Mount API routes
app.use("/api", apiRouter);

// Root route
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>TigerGate Playground</title></head>
      <body>
        <h1>TigerGate Security Playground</h1>
        <p>This is a small educational project with intentional vulnerabilities for testing security scanners.</p>
        <ul>
          <li><strong>POST /api/login</strong> - SAST: SQL Injection</li>
          <li><strong>GET /api/ping?host=127.0.0.1</strong> - SAST: Command Injection</li>
          <li><strong>GET /api/status</strong> - Status check utilizing vulnerable npm packages</li>
        </ul>
      </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
