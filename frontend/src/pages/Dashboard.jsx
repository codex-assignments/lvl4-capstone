import React, { useMemo } from "react";
import { Link } from "react-router";
import { useResources } from "../context/ResourceContext";
import { ResponsiveSankey } from "@nivo/sankey";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
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

  // build sankey diagram from metrics/resources with dynamic stage skipping
  const sankeyData = useMemo(() => {
    if (!resources || resources.length === 0) return null;

    const linkCounts = new Map();
    const activeNodeIds = new Set(["Applied"]);

    resources.forEach((item) => {
      const path = ["Applied"];
      if (item.has_screening) path.push("Screening");
      if (item.has_technical) path.push("Technical");
      if (item.has_interview) path.push("Interview");
      if (item.has_offer) {
        path.push("Offer");
      } else if (item.has_rejected) {
        path.push("Rejected");
      }
      for (let i = 0; i < path.length - 1; i++) {
        const source = path[i];
        const target = path[i + 1];
        activeNodeIds.add(source);
        activeNodeIds.add(target);
        const key = `${source}->${target}`;
        linkCounts.set(key, (linkCounts.get(key) || 0) + 1);
      }
    });

    // stage order, left to right columns
    const masterOrder = [
      "Applied",
      "Screening",
      "Technical",
      "Interview",
      "Offer",
      "Rejected",
    ];

    //  filter so only include ones that actually exist in the data currently
    const nodes = masterOrder
      .filter((id) => activeNodeIds.has(id))
      .map((id) => ({ id }));

    const links = Array.from(linkCounts.entries()).map(([key, value]) => {
      const [source, target] = key.split("->");
      return { source, target, value };
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
    <Container maxWidth="xl" sx={{ py: 1 }}>
      {/* ----- hero with call to action button ---- */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Box maxWidth="md">
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Welcome to AppTrack
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Track your developer job search in real-time. View key metrics below
            or jump straight into your status log to manage applications, record
            interview progress, and update stage statuses.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/log"
          variant="contained"
          size="large"
          color="secondary"
          sx={{
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            minWidth: "fit-content",
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxShadow: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          View / Manage Applications
        </Button>
      </Paper>

      {/* ---Metric Summary Cards --- */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ mb: 5, width: "100%", mx: "auto" }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexGrow: 1 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              textAlign: "center",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
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

        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexGrow: 1 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              textAlign: "center",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
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

        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexGrow: 1 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              textAlign: "center",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
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

        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexGrow: 1 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              textAlign: "center",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
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
          Application Pipeline
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
