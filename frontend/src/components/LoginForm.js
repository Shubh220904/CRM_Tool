import React, { useState } from "react";
import { TextField, Button, Box, Grid, Typography, Link, Paper, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Use useNavigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token); // Store token in localStorage
      window.location.reload(); // Redirect to the homepage upon successful login
    } catch (error) {
      console.error("Login failed:", error);
      // Optionally, display an error message
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          Login to Your Account
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                variant="outlined"
                sx={{ backgroundColor: '#fff' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                variant="outlined"
                sx={{ backgroundColor: '#fff' }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: '10px' }}>
                Login
              </Button>
            </Grid>
          </Grid>
        </form>

        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2, textAlign: 'center' }}>
          <span>Don't have an account?</span>
          <Link href="/register" sx={{ marginLeft: 1 }} color="primary">
            Register here
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
