const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const sqlite3 = require("sqlite3").verbose();
const _ = require("lodash");
const jwt = require("jsonwebtoken");

// Intentional Vulnerability for TigerGate Learning
// Secrets: Hardcoded GitHub Personal Access Token inside the repository
const GITHUB_TOKEN = "ghp_YnC67890aBcdEFGHIJKlmNoPqRstUvwXyz01";

// Initialize an in-memory SQLite database for demonstrations
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, username TEXT, password TEXT, role TEXT)");
  db.run("INSERT INTO users VALUES (1, 'admin', 'super-secret-pass', 'admin')");
  db.run("INSERT INTO users VALUES (2, 'user1', 'mypassword', 'user')");
});

// Endpoint 1: Login showcasing SQL Injection
// Route: POST /api/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // Intentional Vulnerability for TigerGate Learning
  // SAST: SQL Injection (Concatenating raw user inputs into the SQL query string)
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (rows.length > 0) {
      // Use jwt (vulnerable SCA dependency) to sign a web token
      const token = jwt.sign({ username: rows[0].username, role: rows[0].role }, "secret-jwt-key");
      
      // Use lodash (vulnerable SCA dependency) to structure response data
      const responseData = _.merge({}, { success: true, token, user: { username: rows[0].username } });
      return res.json(responseData);
    }
    
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  });
});

// Endpoint 2: Network diagnostic tool showcasing Command Injection
// Route: GET /api/ping
router.get("/ping", (req, res) => {
  const { host } = req.query;

  if (!host) {
    return res.status(400).json({ error: "Host parameter is required" });
  }

  // Intentional Vulnerability for TigerGate Learning
  // SAST: Command Injection (Interpolating user input directly into system command execution)
  const command = `ping -c 1 ${host}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, details: stderr });
    }
    return res.json({ success: true, output: stdout });
  });
});

// Endpoint 3: System Status
// Route: GET /api/status
router.get("/status", (req, res) => {
  // Use lodash defaultsDeep to construct a status response
  const appInfo = _.defaultsDeep(
    { app: "TigerGate Security Playground" },
    { version: "1.0.0", status: "online" }
  );

  res.json({
    status: appInfo.status,
    appName: appInfo.app,
    githubConfigured: !!GITHUB_TOKEN
  });
});

module.exports = router;
