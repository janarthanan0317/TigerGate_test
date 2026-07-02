const express = require("express");
const { exec } = require("child_process");

const apiRouter = require("./routes/api");
const awsConfig = require("./config/aws");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

console.log(`[Config] AWS components loaded for region: ${awsConfig.region}`);

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>TigerGate Playground</title></head>
      <body>
        <h1>TigerGate Security Playground</h1>

        <p>This project intentionally contains vulnerabilities for TigerGate learning.</p>

        <ul>
          <li>POST /login - Intentional SQL/NoSQL Injection</li>
          <li>GET /ping?host=127.0.0.1 - Intentional Command Injection</li>
        </ul>
      </body>
    </html>
  `);
});

/*
|--------------------------------------------------------------------------
| INTENTIONAL VULNERABILITY #1
| SAST - Command Injection
|--------------------------------------------------------------------------
| TigerGate should detect unsanitized user input reaching exec().
| This endpoint is for educational purposes only.
*/
app.get("/ping", (req, res) => {
  const host = req.query.host;

  exec(`ping -c 2 ${host}`, (err, stdout) => {
    if (err) {
      return res.send(err.message);
    }

    res.send(`<pre>${stdout}</pre>`);
  });
});

/*
|--------------------------------------------------------------------------
| INTENTIONAL VULNERABILITY #2
| SAST - SQL/NoSQL Injection Pattern
|--------------------------------------------------------------------------
| This simulates unsafe query construction for security scanners.
*/
app.post("/login", (req, res) => {
  const { username } = req.body;

  // INTENTIONAL VULNERABILITY FOR TIGERGATE TRAINING
  const query = `SELECT * FROM users WHERE username='${username}'`;

  console.log("Executing Query:", query);

  res.json({
    message: "Demo query executed.",
    query,
  });
});

app.listen(PORT, () => {
  console.log(`TigerGate Playground running on http://localhost:${PORT}`);
});
