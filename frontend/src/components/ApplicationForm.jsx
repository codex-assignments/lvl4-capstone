import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

const STAGE_OPTIONS = [
  "Applied",
  "Phone Screening",
  "Interviewing",
  "Technical Assessment",
  "Offer Received",
  "Rejected",
];

export default function ApplicationForm({
  initialData,
  onSubmit,
  onCancel,
  buttonLabel = "Save Application",
}) {
  // if the parent doesn't pass anything, default to the string 'Save Application'

  // if used for updating a card, use existing data
  const [formData, setFormData] = useState({
    company_name: initialData?.company_name || "",
    job_title: initialData?.job_title || "",
    stage: initialData?.stage || "Applied",
    location: initialData?.location || "",
    salary_range: initialData?.salary_range || "",
    tech_stack: Array.isArray(initialData?.tech_stack)
      ? initialData.tech_stack.join(", ")
      : initialData?.tech_stack || "",
    hiring_manager_name: initialData?.hiring_manager_name || "",
    hiring_manager_email: initialData?.hiring_manager_email || "",
    resume_version_used: initialData?.resume_version_used || "",
    job_url: initialData?.job_url || "",
    notes: initialData?.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tech_stack: formData.tech_stack
        ? formData.tech_stack
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean)
        : [],
    };

    onSubmit(payload);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography
        variant="h6"
        component="h3"
        sx={{ mb: 2, fontWeight: "bold" }}
      >
        {/* based on if there is already data */}
        {initialData ? "Edit Application" : "New Application"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Job Title"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Stage"
              name="stage"
              value={formData.stage}
              onChange={handleChange}
            >
              {STAGE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Location"
              name="location"
              placeholder="e.g. Remote, Baton Rouge"
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Salary Range"
              name="salary_range"
              placeholder=" "
              value={formData.salary_range}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Tech Stack"
              name="tech_stack"
              placeholder="React, Python, Supabase, etc"
              value={formData.tech_stack}
              onChange={handleChange}
              helperText="Comma separated values"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Resume Version"
              name="resume_version_used"
              placeholder="e.g. v2_frontend.pdf"
              value={formData.resume_version_used}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Contact Name"
              name="hiring_manager_name"
              value={formData.hiring_manager_name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              type="email"
              label="Contact Email"
              name="hiring_manager_email"
              value={formData.hiring_manager_email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Job URL"
              name="job_url"
              placeholder="https://..."
              value={formData.job_url}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3 }}
        >
          {onCancel && (
            <Button variant="outlined" color="inherit" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" color="primary">
            {buttonLabel}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
