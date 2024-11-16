import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Container, CssBaseline, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, IconButton, Button, Divider } from "@mui/material";
import { Menu as MenuIcon, Home as HomeIcon, AddCircle as AddCircleIcon, ExitToApp as ExitToAppIcon } from "@mui/icons-material";
import Login from "./components/LoginForm";
import Register from "./components/RegisterForm";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactTable";
import ProtectedRoute from "./components/ProtectedRoute";
import EditContact from "./components/EditContact";

// Check if the user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null); // Define user state

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setUser(data);  // Update the user state with fetched data
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setUser(null); // Clear user state
    window.location.href = "/login";
  };

  return (
    <Router>
      <CssBaseline />
      <AppBar position="sticky" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          {isAuthenticated() && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Contact Management
          </Typography>

          {/* Display logout button if user is authenticated */}
          {isAuthenticated() && (
            <Button color="inherit" onClick={handleLogout} style={{ marginLeft: 'auto' }}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer with better styling */}
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#fafafa",
          },
        }}
      >
        <List>
          {isAuthenticated() && (
            <>
              <ListItem button component="a" href="/" sx={{ display: "flex", alignItems: "center" }}>
                <HomeIcon sx={{ marginRight: 2 }} />
                <ListItemText primary="Contact List" />
              </ListItem>
              <Divider />
              <ListItem button component="a" href="/add" sx={{ display: "flex", alignItems: "center" }}>
                <AddCircleIcon sx={{ marginRight: 2 }} />
                <ListItemText primary="Add Contact" />
              </ListItem>
              <Divider />
            </>
          )}
        </List>
        {isAuthenticated() && (
          <ListItem button onClick={handleLogout} sx={{ display: "flex", alignItems: "center" }}>
            <ExitToAppIcon sx={{ marginRight: 2 }} />
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </Drawer>

      <Container maxWidth="lg" style={{ marginTop: 80 }}>
        <Routes>
          {/* Redirect to login/register if not authenticated */}
          <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <ContactList />
            </ProtectedRoute>
          } />

          <Route path="/add" element={
            <ProtectedRoute>
              <ContactForm />
            </ProtectedRoute>
          } />

          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditContact />
            </ProtectedRoute>
          } />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
