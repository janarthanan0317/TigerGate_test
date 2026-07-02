const express = require("express");

const apiRouter = require("./routes/api");
const awsConfig = require("./config/aws");

const app = express();
const PORT = process.env.PORT || 3000;
const appName = "TigerGate Security Playground";
const demoEndpoints = [
  "POST /api/login - Intentional SQL Injection",
  "GET /api/ping?host=127.0.0.1 - Intentional Command Injection",
  "GET /api/status - Status check using vulnerable dependencies",
];

app.use(express.json());

console.log(`[Config] AWS components loaded for region: ${awsConfig.region}`);

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  const endpointItems = demoEndpoints
    .map((endpoint) => `<li>${endpoint}</li>`)
    .join("");

  res.send(`
    <html>
      <head><title>${appName}</title></head>
      <body>
        <h1>${appName}</h1>

        <p>This project intentionally contains vulnerabilities for TigerGate learning.</p>

        <ul>${endpointItems}</ul>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`TigerGate Playground running on http://localhost:${PORT}`);
});
