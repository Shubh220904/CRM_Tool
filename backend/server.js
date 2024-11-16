const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const generateAuthToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

// Register Endpoint
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    const user = result.rows[0];
    const token = generateAuthToken(user.id);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: "Error registering user" });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = generateAuthToken(user.id);
  res.json({ token });
});

// Get Contacts Endpoint
app.get("/contacts", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query("SELECT * FROM contacts WHERE user_id = $1", [decoded.userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
});

// Add Contact Endpoint
app.post("/contacts", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { firstName, lastName, email, phone, company, jobTitle } = req.body;
    const result = await pool.query(
      "INSERT INTO contacts (first_name, last_name, email, phone, company, job_title, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [firstName, lastName, email, phone, company, jobTitle, decoded.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Error adding contact" });
  }
});

// Update Contact Endpoint
app.put("/contacts/:id", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;
    const { firstName, lastName, email, phone, company, jobTitle } = req.body;
    const result = await pool.query(
      "UPDATE contacts SET first_name = $1, last_name = $2, email = $3, phone = $4, company = $5, job_title = $6 WHERE id = $7 AND user_id = $8 RETURNING *",
      [firstName, lastName, email, phone, company, jobTitle, id, decoded.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Error updating contact" });
  }
});

// Delete Contact Endpoint
app.delete("/contacts/:id", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;
    await pool.query("DELETE FROM contacts WHERE id = $1 AND user_id = $2", [id, decoded.userId]);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Error deleting contact" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
