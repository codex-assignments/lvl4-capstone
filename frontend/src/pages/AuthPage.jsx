import React from "react";
import { useNavigate, Navigate } from "react-router";
import { useResources } from "../context/ResourceContext";
import AuthForm from "../components/AuthForm";
import { Container, Box, Typography } from "@mui/material";

export default function AuthPage() {
  const { token } = useResources();
  const navigate = useNavigate();

  // redirect to Status Log if logged in
  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleAuthSuccess = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Application Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Log in or sign up to manage your job applications
        </Typography>
      </Box>

      <AuthForm onSuccess={handleAuthSuccess} />
    </Container>
  );
}
