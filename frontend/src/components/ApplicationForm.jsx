import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

export default function ApplicationForm({
  initialValues = {},
  onSubmit,
  onCancel,
  buttonLabel = "Save",
}) {
  // if the parent doesn't pass anything, default to the string 'Save'

  // if used for updating a card, use existing data of if it doesn't exist, start with empty string or false value
const [formData, setFormData] = useState({
  company_name: initialValues.company_name || "",
  job_title: initialValues.job_title || "",
  location: initialValues.location || "",
  salary_range: initialValues.salary_range || "",
  tech_stack: initialValues.tech_stack || "",
  notes: initialValues.notes || "",
  resume_version: initialValues.resume_version || "",
  hiring_manager_name: initialValues.hiring_manager_name || "",
  hiring_manager_email: initialValues.hiring_manager_email || "",
  date_applied:
    initialValues.date_applied || new Date().toISOString().split("T")[0],
  last_contact:
    initialValues.last_contact || new Date().toISOString().split("T")[0],
  has_screening: initialValues.has_screening || false,
  has_technical: initialValues.has_technical || false,
  has_interview: initialValues.has_interview || false,
  has_offer: initialValues.has_offer || false,
  has_rejected: initialValues.has_rejected || false,
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
const sanitizedPayload = {
  ...formData,
  date_applied: formData.date_applied || null,
  last_contact: formData.last_contact || null,
  location: formData.location || null,
  salary_range: formData.salary_range || null,
  notes: formData.notes || null,
};

onSubmit(sanitizedPayload);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        {/* if component is used to create a new application vs editing a card */}
        {initialValues.id ? "Edit Application" : "New Application"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <TextField
              required
              fullWidth
              size="small"
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              required
              fullWidth
              size="small"
              label="Job Title"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Location"
              name="location"
              placeholder="e.g. Remote, Baton Rouge, LA"
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Salary Range"
              name="salary_range"
              placeholder="e.g. $75k - $85k"
              value={formData.salary_range}
              onChange={handleChange}
            />
          </Grid>

          {/* contact and resume version */}
          <Grid xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Resume Version"
              name="resume_version"
              placeholder="e.g. v2_frontend.pdf"
              value={formData.resume_version}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Hiring Manager Name"
              name="hiring_manager_name"
              value={formData.hiring_manager_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              type="email"
              label="Hiring Manager Email"
              name="hiring_manager_email"
              value={formData.hiring_manager_email}
              onChange={handleChange}
            />
          </Grid>

          {/* dates */}
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date Applied"
              name="date_applied"
              InputLabelProps={{ shrink: true }}
              value={formData.date_applied}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Last Contact"
              name="last_contact"
              InputLabelProps={{ shrink: true }}
              value={formData.last_contact}
              onChange={handleChange}
            />
          </Grid>

          {/* tech stack and notes */}
          <Grid xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Tech Stack"
              name="tech_stack"
              placeholder="Comma separated e.g. React, Python, Flask"
              value={formData.tech_stack}
              onChange={handleChange}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>

          {/* stage checkboxes */}
          <Grid xs={12}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}
            >
              Stages Completed:
            </Typography>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.has_screening}
                    onChange={handleCheckboxChange}
                    name="has_screening"
                  />
                }
                label="Screening"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.has_technical}
                    onChange={handleCheckboxChange}
                    name="has_technical"
                  />
                }
                label="Technical"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.has_interview}
                    onChange={handleCheckboxChange}
                    name="has_interview"
                  />
                }
                label="Interview"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.has_offer}
                    onChange={handleCheckboxChange}
                    name="has_offer"
                    color="success"
                  />
                }
                label="Offer"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.has_rejected}
                    onChange={handleCheckboxChange}
                    name="has_rejected"
                    color="error"
                  />
                }
                label="Rejected"
              />
            </FormGroup>
          </Grid>

          {/* buttons */}
          <Grid
            xs={12}
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 1 }}
          >
            {onCancel && (
              <Button size="small" variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button size="small" variant="contained" type="submit">
              {buttonLabel}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
