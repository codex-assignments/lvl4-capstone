import React from "react";
import { useResources } from "../context/ResourceContext";
import LogCard from "../components/LogCard";
import { Container, CircularProgress, Alert, Box } from "@mui/material";

export default function StatusLog() {
  const { resources, loading, error } = useResources();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <div className="status-log-page">
        <h2>Status Log</h2>

        {!resources || resources.length === 0 ? (
          <p className="empty-state">No records yet.</p>
        ) : (
          <div className="log-list">
            {resources.map((item) => (
              <LogCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
