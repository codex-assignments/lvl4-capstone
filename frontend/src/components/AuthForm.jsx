import React, { useState } from "react";
import { useResources } from "../context/ResourceContext";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";

export default function AuthForm({ onSuccess }) {
  const { login, signup } = useResources();
    const [tab, setTab] = useState(0);
    // toggle tab view, if set to 0 = login, 1 = sign up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

      try {
        // log in or sign up
      if (tab === 0) {
        await login(email, password);
      } else {
        await signup(email, password);
        await login(email, password);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 420, mx: "auto", p: 4, borderRadius: 2 }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Log In" />
          <Tab label="Sign Up" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography
          variant="h6"
          sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
        >
          {tab === 0 ? "Welcome Back" : "Create Account"}
        </Typography>

        <TextField
          fullWidth
          size="small"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ py: 1.2, fontWeight: "bold" }}
        >
          {loading ? "Processing..." : tab === 0 ? "Log In" : "Sign Up"}
        </Button>
      </Box>
    </Paper>
  );
}
