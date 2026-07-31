import React, { useState, useMemo } from "react";
import { useResources } from "../context/ResourceContext";
import LogCard from "../components/LogCard";
import ApplicationForm from "../components/ApplicationForm";
import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Button,
  TextField,
  MenuItem,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

const STAGE_FILTER_OPTIONS = [
  "All Stages",
  "Applied",
  "Screening",
  "Technical",
  "Interview",
  "Offer",
  "Rejected",
];

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
  // filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedTech, setSelectedTech] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const isLoggedIn = Boolean(token);
  // const isLoggedIn = true

  // --------- filter logic -----------
  // get all unique stack tags
  const allTechTags = useMemo(() => {
    if (!resources) return [];
    const tagsSet = new Set();
    resources.forEach((item) => {
      if (!item.tech_stack) return;
      const tags = Array.isArray(item.tech_stack)
        ? item.tech_stack
        : item.tech_stack.split(",").map((t) => t.trim());
      tags.forEach((tag) => tag && tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [resources]);
  // filter based on search, stage booleans, and tech tags
  const filteredResources = useMemo(() => {
    if (!resources) return [];
    return resources.filter((item) => {
      // global search string matching across multiple fields
      const searchTarget = [
        item.company_name,
        item.job_title,
        item.location,
        item.notes,
        item.resume_version,
        item.hiring_manager_name,
        item.hiring_manager_email,
        Array.isArray(item.tech_stack)
          ? item.tech_stack.join(" ")
          : item.tech_stack,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchTerm || searchTarget.includes(searchTerm.toLowerCase());

      // stage filter`
      let matchesStage = true;
      if (selectedStage === "Applied") {
        matchesStage =
          !item.has_screening &&
          !item.has_technical &&
          !item.has_interview &&
          !item.has_offer &&
          !item.has_rejected;
      } else if (selectedStage === "Screening") {
        matchesStage = Boolean(item.has_screening);
      } else if (selectedStage === "Technical") {
        matchesStage = Boolean(item.has_technical);
      } else if (selectedStage === "Interview") {
        matchesStage = Boolean(item.has_interview);
      } else if (selectedStage === "Offer") {
        matchesStage = Boolean(item.has_offer);
      } else if (selectedStage === "Rejected") {
        matchesStage = Boolean(item.has_rejected);
      }

      // tech tag filter
      const itemTechs = Array.isArray(item.tech_stack)
        ? item.tech_stack
        : item.tech_stack?.split(",").map((t) => t.trim()) || [];
      const matchesTech =
        !selectedTech ||
        itemTechs.some((t) => t.toLowerCase() === selectedTech.toLowerCase());

      return matchesSearch && matchesStage && matchesTech;
    });
  }, [resources, searchTerm, selectedStage, selectedTech]);
  // ----------------- end of filter logic ------------------------

  // for creating new application entry
  const handleCreateSubmit = async (payload) => {
    await addResource(payload);
    setShowAddForm(false);
  };

  const handleEditSubmit = async (payload) => {
    if (!editingItem) return;
    await updateResource(editingItem.id, payload);
    setEditingItem(null);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStage("All Stages");
    setSelectedTech("");
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
        {/* form for editing */}
        {isLoggedIn && editingItem && (
          <ApplicationForm
            initialValues={editingItem}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingItem(null)}
            buttonLabel="Update Application"
          />
        )}

        {/* FILTER CONTROL BAR */}
        <Box
          sx={{
            my: 3,
            p: 2.5,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            sx={{ mb: allTechTags.length > 0 ? 2 : 0 }}
          >
            {/* global search bar */}
            <TextField
              fullWidth
              size="small"
              label="Search applications"
              placeholder="Company, title, manager, resume version..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* stage dropdown filter */}
            <TextField
              select
              size="small"
              label="Stage"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              sx={{ minWidth: { sm: 200 }, width: { xs: "100%", sm: "auto" } }}
            >
              {STAGE_FILTER_OPTIONS.map((stage) => (
                <MenuItem key={stage} value={stage}>
                  {stage}
                </MenuItem>
              ))}
            </TextField>

            {/* clear filters btn */}
            {(searchTerm || selectedStage !== "All Stages" || selectedTech) && (
              <Button
                size="small"
                color="secondary"
                onClick={handleClearFilters}
                sx={{ whitespace: "nowrap" }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>

          {/* tech chips */}
          {allTechTags.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1 }}>
                Filter Tech:
              </Typography>
              {allTechTags.map((tech) => {
                const isSelected =
                  selectedTech.toLowerCase() === tech.toLowerCase();
                return (
                  <Chip
                    key={tech}
                    label={tech}
                    size="small"
                    clickable
                    color={isSelected ? "primary" : "default"}
                    variant={isSelected ? "filled" : "outlined"}
                    onClick={() => setSelectedTech(isSelected ? "" : tech)}
                  />
                );
              })}
            </Box>
          )}
        </Box>

        {/* --- display cards --- */}
        {!filteredResources || filteredResources.length === 0 ? (
          <p className="empty-state">
            {resources?.length === 0
              ? "No status logs recorded yet."
              : "No applications match your current filters."}
          </p>
        ) : (
          <div className="log-list">
            {filteredResources.map((item) => (
              <LogCard
                key={item.id}
                item={item}
                isLoggedIn={isLoggedIn}
                onEdit={() => {
                  setShowAddForm(false); // Close create form if open
                  setEditingItem(item);
                }}
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
