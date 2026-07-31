import React, { useMemo } from "react";
import { useResources } from "../context/ResourceContext";
import { ResponsiveSankey } from "@nivo/sankey";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function Dashboard() {
  const { resources, loading, error } = useResources();

  // useMemo is a React Hook that lets you cache the result of a calculation between re-renders
  // const cachedValue = useMemo(calculateValue, dependencies)
  const metrics = useMemo(() => {
    if (!resources) return { total: 0, active: 0, interviews: 0, offers: 0 };

    let total = resources.length;
    let active = 0;
    let interviews = 0;
    let offers = 0;

    resources.forEach((item) => {
      if (item.has_offer) {
        offers += 1;
        if (!item.has_rejected) active += 1;
      } else if (
        item.has_interview ||
        item.has_technical ||
        item.has_screening
      ) {
        if (item.has_interview) interviews += 1;
        if (!item.has_rejected) active += 1;
      } else if (!item.has_rejected) {
        active += 1;
      }
    });

    return { total, active, interviews, offers };
  }, [resources]);

  // build sankey diagram from metrics/resources
  // need counts, nodes, and links
  const sankeyData = useMemo(() => {
    if (!resources) return null;

    // initalize counts for each stage
    const counts = {
      Applied: resources.length,
      Screening: 0,
      Technical: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    resources.forEach((item) => {
      if (item.has_screening) counts.Screening += 1;
      if (item.has_technical) counts.Technical += 1;
      if (item.has_interview) counts.Interview += 1;
      if (item.has_offer) counts.Offer += 1;
      if (item.has_rejected) counts.Rejected += 1;
    });

    // nodes, list of visual blocks that a sankey diagram links up from left to right for the same object
    const nodes = [
      { id: "Applied" },
      { id: "Screening" },
      { id: "Technical" },
      { id: "Interview" },
      { id: "Offer" },
      { id: "Rejected" },
    ].filter((node) => {
      if (node.id === "Applied") return true;
      return counts[node.id] > 0;
    });

    // create the links between starting point node and ending point node
    const links = [];
    if (counts.Screening > 0)
      links.push({
        source: "Applied",
        target: "Screening",
        value: counts.Screening,
      });
    if (counts.Technical > 0)
      links.push({
        source: "Screening",
        target: "Technical",
        value: counts.Technical,
      });
    if (counts.Interview > 0)
      links.push({
        source: "Technical",
        target: "Interview",
        value: counts.Interview,
      });
    if (counts.Offer > 0)
      links.push({
        source: "Interview",
        target: "Offer",
        value: counts.Offer,
      });
    if (counts.Rejected > 0)
      links.push({
        source: "Applied",
        target: "Rejected",
        value: counts.Rejected,
      });

    return { nodes, links };
  }, [resources]);

  // loading progress animation
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
        }}
      >
        <CircularProgress size={28} />
      </Box>
    );
  }

  // error visual
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Dashboard Overview
      </Typography>

      {/* ---Metric Summary Cards --- */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{ p: 3, borderRadius: 2, textAlign: "center" }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: "bold" }}
            >
              Total Applied
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", mt: 1, color: "primary.main" }}
            >
              {metrics.total}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{ p: 3, borderRadius: 2, textAlign: "center" }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: "bold" }}
            >
              Active Pipeline
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", mt: 1, color: "info.main" }}
            >
              {metrics.active}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{ p: 3, borderRadius: 2, textAlign: "center" }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: "bold" }}
            >
              Interviews
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", mt: 1, color: "warning.main" }}
            >
              {metrics.interviews}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{ p: 3, borderRadius: 2, textAlign: "center" }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: "bold" }}
            >
              Offers
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", mt: 1, color: "success.main" }}
            >
              {metrics.offers}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* --- Sankey Diagram --- */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Application Pipeline Flow
        </Typography>

        {!sankeyData || sankeyData.links.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 6, textAlign: "center" }}
          >
            Add more applications to populate the Sankey diagram.
          </Typography>
        ) : (
          <Box sx={{ height: 400 }}>
            <ResponsiveSankey
              data={sankeyData}
              margin={{ top: 20, right: 120, bottom: 20, left: 120 }}
              align="justify"
              colors={{ scheme: "category10" }}
              nodeOpacity={1}
              nodeHoverOthersOpacity={0.35}
              nodeThickness={18}
              nodeSpacing={24}
              nodeBorderWidth={0}
              linkOpacity={0.5}
              linkHoverOthersOpacity={0.1}
              enableLinkGradient={true}
              labelPosition="inside"
              labelOrientation="horizontal"
              labelPadding={16}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
}
