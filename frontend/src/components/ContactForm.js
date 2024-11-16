import React, { useState } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddContact = () => {
  const navigate = useNavigate();
  
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const validatePhone = (phone) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;
    let newErrorMessages = { ...errorMessages };

    // Validate required fields and formats
    Object.keys(contact).forEach((key) => {
      if (!contact[key]) {
        valid = false;
        newErrorMessages[key] = `${key} is required.`;
      } else {
        newErrorMessages[key] = "";  // Clear any existing errors
      }
    });

    if (contact.email && !validateEmail(contact.email)) {
      valid = false;
      newErrorMessages.email = "Please enter a valid email address.";
    }

    if (contact.phone && !validatePhone(contact.phone)) {
      valid = false;
      newErrorMessages.phone = "Please enter a valid 10-digit phone number.";
    }

    setErrorMessages(newErrorMessages);

    if (valid) {
      const token = localStorage.getItem("token");
      axios
        .post("http://localhost:5000/contacts", contact, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          navigate("/");  // Navigate to the contact list page after adding
        })
        .catch((error) => console.error("Error adding contact:", error));
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h2>Add New Contact</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={contact.firstName}
              onChange={handleChange}
              fullWidth
              required
              error={!!errorMessages.firstName}
              helperText={errorMessages.firstName}
              placeholder="Enter first name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={contact.lastName}
              onChange={handleChange}
              fullWidth
              required
              error={!!errorMessages.lastName}
              helperText={errorMessages.lastName}
              placeholder="Enter last name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={contact.email}
              onChange={handleChange}
              fullWidth
              required
              error={!!errorMessages.email}
              helperText={errorMessages.email}
              placeholder="Enter email"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              value={contact.phone}
              onChange={handleChange}
              fullWidth
              required
              error={!!errorMessages.phone}
              helperText={errorMessages.phone}
              placeholder="Enter phone number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company"
              name="company"
              value={contact.company}
              onChange={handleChange}
              fullWidth
              required
              error={!!errorMessages.company}
              helperText={errorMessages.company}
              placeholder="Enter company name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Job Title"
              name="jobTitle"
              value={contact.jobTitle}
              onChange={handleChange}
              fullWidth
              required
              error={!!errorMessages.jobTitle}
              helperText={errorMessages.jobTitle}
              placeholder="Enter job title"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Contact
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddContact;
