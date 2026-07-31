import React from "react";
import { Routes, Route } from "react-router";
import { CssBaseline, Container, Box } from "@mui/material";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import StatusLog from "./pages/StatusLog";
import AuthPage from "./pages/AuthPage";
import "./App.css";

export default function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <CssBaseline />

      <NavBar />

      <Container component="main" maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<StatusLog />} />
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </Container>
    </Box>
  );
}
