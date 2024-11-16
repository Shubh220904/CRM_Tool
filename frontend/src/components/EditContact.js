import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Helper function to convert snake_case to camelCase
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

// Helper function to convert camelCase to snake_case
const toSnakeCase = (str) => {
  return str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
};

const EditContact = () => {
  const { id } = useParams(); // Get contact ID from URL (only for editing)
  const navigate = useNavigate();

  // Initial state for the form fields (camelCase)
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

  // Fetch contact data for editing when ID is present
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/contacts/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          // Map snake_case to camelCase
          const fetchedContact = Object.keys(response.data).reduce((acc, key) => {
            acc[toCamelCase(key)] = response.data[key];
            return acc;
          }, {});
          setContact(fetchedContact);
        })
        .catch((error) => console.error("Error fetching contact:", error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const validatePhone = (phone) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
  };

  // Handle form submission
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
        newErrorMessages[key] = ""; // Clear any existing errors
      }
    });

    // Email validation
    if (contact.email && !validateEmail(contact.email)) {
      valid = false;
      newErrorMessages.email = "Please enter a valid email address.";
    }

    // Phone validation
    if (contact.phone && !validatePhone(contact.phone)) {
      valid = false;
      newErrorMessages.phone = "Please enter a valid 10-digit phone number.";
    }

    // Set error messages
    setErrorMessages(newErrorMessages);

    // If form is valid, proceed with submission
    if (valid) {
      const token = localStorage.getItem("token");

      // Convert camelCase to snake_case for submission
      const contactToSubmit = Object.keys(contact).reduce((acc, key) => {
        acc[toSnakeCase(key)] = contact[key];
        return acc;
      }, {});

      axios
        .put(`http://localhost:5000/contacts/${id}`, contactToSubmit, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          navigate("/"); // Navigate back to the contact list page
        })
        .catch((error) => console.error("Error updating contact:", error));
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h2>Edit Contact</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={contact.firstName || ""}
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
              value={contact.lastName || ""}
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
              value={contact.email || ""}
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
              value={contact.phone || ""}
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
              value={contact.company || ""}
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
              value={contact.jobTitle || ""}
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
              Update Contact
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EditContact;
