import React, { useState , useMemo } from "react";
import StockTable from "./components/StockTable";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  ThemeProvider,
  createTheme,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Checkbox,
  Chip,
  Link as MuiLink,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { motion, AnimatePresence } from "framer-motion";


const API_URL = "https://screenerv2-backend.vercel.app/database/conditionalstock";


const blueTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#001f3f",
      paper: "rgba(0, 51, 102, 0.4)",
    },
    
primary:{
  main:"#00E5FF",
  contrastText:"#fff"
},
secondary:{
  main:"#FFD54F"
},
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 16,
  },
});

const fields = [
  { value: "symbol", label: "Symbol" },
  { value: "regularmarketprice", label: "Market Price in Rs" },
  { value: "marketcap", label: "Market Cap in Cr" },
  { value: "trailingpe", label: "PE Ratio" },
  { value: "bookvalue", label: "Book Value" },
  { value: "dividendrate", label: "Dividend Rate (%)" },
  { value: "returnonequity", label: "Return on Equity (%)" },
];

const operators = [
  { value: "=", label: "=" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
];

let nextId = 1;


function BackgroundLayer({ variant }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
      })),
    []
  );
  const isResults = variant === "results";

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        zIndex: -2,
        backgroundColor: "#000c24",
      }}
    >
      <motion.img
        src="/backgrounds/market-bg.png"
        alt=""
        initial={{ scale: 1.08, x: isResults ? 10 : -10, y: 0 }}
        animate={{
          scale: [1.08, 1.18, 1.08],
          x: isResults ? [10, -20, 10] : [-10, 20, -10],
          y: [0, -15, 0],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: isResults ? "scaleX(-1)" : "none",
          filter: isResults
            ? "hue-rotate(30deg) saturate(1.15) brightness(0.85)"
            : "brightness(0.85)",
        }}
      />


      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,8,24,0.55) 0%, rgba(0,8,24,0.75) 55%, rgba(0,8,24,0.92) 100%)",
        }}
      />
       

      {particles.map((p) => (
        <motion.div
        key={p.id}
        animate={{
          y: [0, -50, 0],
          opacity: [0.12, 0.5, 0.1],
        }}
        transition={{
          duration: 6 + p.id,
          repeat: Infinity,
          delay: p.id * 0.3,
        }}
        style={{
          position: "absolute",
          left: `${p.left}%`,
          top: `${p.top}%`,
          width: 3,
          height: 3,
          borderRadius: "50%",
          background: "#00e5ff",
        }}
      />
      ))}
    </Box>
  );
}


function App() {
  const [stocks, setStocks] = useState([]);
  const [conditions, setConditions] = useState([
    { id: nextId++, field: "regularmarketprice", operator: ">", value: "1000", enabled: false },
  ]);
  const [page, setPage] = useState("filter"); // "filter" | "results"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConditionChange = (idx, key, val) => {
    const updated = [...conditions];
    updated[idx][key] = val;
    setConditions(updated);
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      { id: nextId++, field: "marketcap", operator: ">", value: "", enabled: false },
    ]);
  };

  const removeCondition = (idx) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };

  const fetchStocks = async () => {
    setLoading(true);
    setError(null);


    const payload = conditions
  .filter((c) => c.enabled && c.value !== "")
  .map(({ field, operator, value }) => ({
    field,
    operator,
    value,
  }));

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setStocks(Array.isArray(data) ? data : []);
      setPage("results");
    } catch (err) {
      console.error("Error fetching stocks:", err);
      setError("Couldn't reach the screener backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = () => {
    if (!stocks.length) return;
    const headers = [
      "Symbol",
      "Market Price in Rs",
      "Market Cap in Cr",
      "PE Ratio",
      "Book Value",
      "Dividend Rate (%)",
      "Return on Equity (%)",
    ];
    const rows = stocks.map((s) => [
      (s.symbol || "").replace(".NS", ""),
      s.regularmarketprice,
      s.marketcap ? Math.ceil(s.marketcap / 10000000) : "-",
      s.trailingpe,
      s.bookvalue,
      s.dividendrate,
      s.returnonequity,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_screener_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ThemeProvider theme={blueTheme}>

      <BackgroundLayer variant={page} />

      
      <AppBar
        position="static"
        color="transparent"
        sx={{
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <img
              src="/ProfNITT-logo.png"
              alt="ProfNITT Logo"
              style={{ height: 48, marginRight: 16 }}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#00e5ff" }}>
            Stock Screener
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth={page === "results" ? "xl" : "md"}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "85vh",
          transition: "max-width 0.3s ease",
        }}
      >
        <AnimatePresence mode="wait">
          {page === "filter" && (
            <motion.div
              key="filter"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ width: "100%" }}
            >
              <Paper
                elevation={10}
                sx={{
                  p: 4,
                  mt: 4,
                  mb: 4,
                  background: "#121C2F",
                  borderRadius: 4,
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 25px 60px rgba(0,0,0,.45), 0 0 35px rgba(24,216,255,.15)",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#fff", letterSpacing: 0.5 }}
                >
                  Stock Screener
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.5)", mb: 3 }}>
                  Build your filter to find matching stocks
                </Typography>

                {conditions.map((cond, idx) => (
                  <Box
                    key={cond.id}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      alignItems: { xs: "stretch", sm: "flex-end" },
                      mb: 2.5,
                    }}
                  >
                    <FormControl sx={{ flex: { sm: "1 1 260px" }, minWidth: { xs: "100%", sm: 220 } }}>
                      <InputLabel>Field</InputLabel>
                      <Select
                        value={cond.field}
                        label="Field"
                        onChange={(e) => handleConditionChange(idx, "field", e.target.value)}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              background: "rgba(18, 30, 49, 0.95)",
                              backdropFilter: "blur(20px)",
                              border: "1px solid rgba(0,229,255,0.15)",
                              borderRadius: 1,
                              color: "#fff",
                              mt: 1,
                            },
                          },
                        }}
                      >
                        {fields.map((f) => (
                          <MenuItem key={f.value} value={f.value}>
                            {f.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ flex: { sm: "0 0 110px" }, minWidth: { xs: "100%", sm: 110 } }}>
                      <InputLabel>Operator</InputLabel>
                      <Select
                        value={cond.operator}
                        label="Operator"
                        onChange={(e) => handleConditionChange(idx, "operator", e.target.value)}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              background: "rgba(18, 30, 49, 0.95)",
                              backdropFilter: "blur(20px)",
                              border: "1px solid rgba(0,229,255,0.15)",
                              borderRadius: 1,
                              color: "#fff",
                              mt: 1,
                            },
                          },
                        }}
                      >
                        {operators.map((o) => (
                          <MenuItem key={o.value} value={o.value}>
                            {o.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Value"
                      value={cond.value}
                      onChange={(e) => handleConditionChange(idx, "value", e.target.value)}
                      sx={{ flex: { sm: "0 0 150px" }, minWidth: { xs: "100%", sm: 150 } }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: { xs: "flex-end", sm: "flex-start" },
                        gap: 0.5,
                        flex: { sm: "0 0 auto" },
                        height: 56,
                      }}
                    >
                      <Checkbox
                        checked={cond.enabled}
                        onChange={(e) => handleConditionChange(idx, "enabled", e.target.checked)}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                        color="secondary"
                        title="Include this condition"
                      />
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => removeCondition(idx)}
                        disabled={conditions.length === 1}
                      >
                        <RemoveCircleIcon fontSize="small" />
                      </IconButton>
                      {idx === conditions.length - 1 && (
                        <IconButton size="small" color="primary" onClick={addCondition}>
                          <AddCircleIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                ))}

               

                {error && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchStocks}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontWeight: "bold",
                      letterSpacing: 1,
                      boxShadow: "0 0 20px rgba(33,150,243,0.4)",
                      "&:hover": { boxShadow: "0 0 25px rgba(33,150,243,0.7)" },
                    }}
                    fullWidth
                  >
                    {loading ? "Filtering..." : "Filter"}
                  </Button>
                </motion.div>
              </Paper>
            </motion.div>
          )}

          {page === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ width: "100%" }}
            >
              <Box sx={{ mt: 4, mb: 6 }}>
                <MuiLink
                  component="button"
                  onClick={() => setPage("filter")}
                  underline="hover"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#2196f3",
                    mb: 2,
                  }}
                >
                  <ArrowBackIcon fontSize="small" /> Back to Filter
                </MuiLink>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
                      Stock Results
                    </Typography>
                    <Chip
                      label={`${stocks.length} Stocks Found`}
                      sx={{
                        backgroundColor: "rgba(33,150,243,0.2)",
                        color: "#00e5ff",
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<FileDownloadIcon />}
                    onClick={exportCsv}
                    disabled={!stocks.length}
                  >
                    Export CSV
                  </Button>
                </Box>

                {stocks.length > 0 ? (
                  <StockTable stocks={stocks} />
                ) : (
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: "center",
                      backgroundColor: "rgba(0, 51, 102, 0.4)",
                      borderRadius: 4,
                    }}
                  >
                    <Typography color="secondary" sx={{ fontWeight: "bold" }}>
                      No results found.
                    </Typography>
                  </Paper>
                )}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </ThemeProvider>
  );
}

export default App;
