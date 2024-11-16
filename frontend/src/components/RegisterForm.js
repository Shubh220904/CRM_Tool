import React, { useState } from "react";
import { TextField, Button, Box, Grid, Typography, Link, Paper, Container, Alert } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for errors

  const validateForm = () => {
    let isValid = true;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        email,
        password,
      });

      setSuccessMessage("Registration successful! You can now login.");
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("Registration failed. Please try again.");
      setSuccessMessage(""); // Clear success message if an error occurs
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          Create Your Account
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
                error={!!emailError}
                helperText={emailError}
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
                error={!!passwordError}
                helperText={passwordError}
                variant="outlined"
                sx={{ backgroundColor: '#fff' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                variant="outlined"
                sx={{ backgroundColor: '#fff' }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: '10px' }}>
                Register
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Display success or error message */}
        {successMessage && (
          <Alert severity="success" sx={{ marginTop: 2, width: '100%' }}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ marginTop: 2, width: '100%' }}>
            {errorMessage}
          </Alert>
        )}

        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2, textAlign: 'center' }}>
          <span>Already have an account?</span>
          <Link href="/login" sx={{ marginLeft: 1 }} color="primary">
            Login here
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
