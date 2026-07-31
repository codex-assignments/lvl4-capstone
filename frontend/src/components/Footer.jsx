import React from "react";
import { Box, Container, Typography, Link as MuiLink } from "@mui/material";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto", // Pushes footer to bottom of container if flex layout is used
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            AppTrack &copy; {currentYear} &bull; Job Application Tracker by Ashley Flynn
          </Typography>

          <Typography variant="caption" color="text.secondary">
            v1.0.0 &bull; React + Vite &bull; Flask &bull; Supabase
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
