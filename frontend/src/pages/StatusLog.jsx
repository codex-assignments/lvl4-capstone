import React, { useState } from "react";
import { useResources } from "../context/ResourceContext";
import LogCard from "../components/LogCard";
import ApplicationForm from "../components/ApplicationForm";
import { Container, CircularProgress, Alert, Box, Button } from "@mui/material";

export default function StatusLog() {
  const {
    resources,
    loading,
    error,
    token,
    addResource,
    updateResource,
    deleteResource,
  } = useResources();

  const [showAddForm, setShowAddForm] = useState(false);
  const isLoggedIn = Boolean(token);
  // const isLoggedIn = true

  // for creating new application entry
  const handleCreateSubmit = async (payload) => {
    // auto applied date
    const newEntry = {
      ...payload,
      date_applied: new Date().toISOString().split("T")[0],
    };
    await addResource(newEntry);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          py: 8,
        }}
      >
        <CircularProgress size={24} />
        <span>Please Wait...</span>
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
        <div className="status-log-header">
          <h2>Status Log</h2>

          {/* show 'New Application' toggle button only when logged in */}
          {isLoggedIn && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "− Cancel" : "+ New Application"}
            </Button>
          )}
        </div>

        {/* expandable form at the top for logged in users */}
        {isLoggedIn && showAddForm && (
          <ApplicationForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setShowAddForm(false)}
            buttonLabel="Add Application"
          />
        )}

        {!resources || resources.length === 0 ? (
          <p className="empty-state">No status logs recorded yet.</p>
        ) : (
          <div className="log-list">
            {resources.map((item) => (
              <LogCard
                key={item.id}
                item={item}
                isLoggedIn={isLoggedIn}
                onUpdate={updateResource}
                onDelete={deleteResource}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
