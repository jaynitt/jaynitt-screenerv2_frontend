import React, { useEffect, useState } from "react";
import StockTable from "./components/StockTable";
import {
  TextField, Button, Container, Typography, MenuItem, Select,
  FormControl, InputLabel, Box, ThemeProvider, createTheme, Paper, AppBar, Toolbar, IconButton
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { motion } from "framer-motion";
// ==================== THEME ====================
const blueTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#001f3f", // deep navy
      paper: "rgba(0, 51, 102, 0.4)", // transparent blue glass
    },
    primary: {
      main: "#2196f3", // bright blue
      contrastText: "#fff",
    },
    secondary: {
      main: "#00e5ff", // aqua accent
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    fontWeightBold: 600,
  },
});

const fields = [
  { value: "symbol", label: "Symbol" },
  { value: "regularmarketprice", label: "Market Price" },
  { value: "marketcap", label: "Market Cap" },
  { value: "trailingpe", label: "PE Ratio" },
  { value: "bookvalue", label: "Book Value" },
  { value: "dividendrate", label: "Dividend Rate" },
  { value: "returnonequity", label: "Return on Equity" },
];

const operators = [
  { value: "=", label: "=" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
];

// ==================== APP ====================
function App() {
  const [stocks, setStocks] = useState([]);
  const [conditions, setConditions] = useState([
    { field: "marketcap", operator: ">", value: "20" },
  ]);
  const [queried, setQueried] = useState(false);
useEffect(() => {
  
fetchStocks()

}, [])




  const handleConditionChange = (idx, key, val) => {
    const updated = [...conditions];
    updated[idx][key] = val;
    setConditions(updated);
  };

  const addCondition = () => {
    setConditions([...conditions, { field: "marketcap", operator: ">", value: "" }]);
  };

  const removeCondition = (idx) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };

  const fetchStocks = async () => {
    const url = "https://screenerv2-backend.vercel.app/database/conditionalstock";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(conditions),
    };
    const res = await fetch(url, options);
    const data = await res.json();
    console.log(data)
    setStocks(data);
    setQueried(true);
  };

  return (
    <ThemeProvider theme={blueTheme}>
      {/* Animated Gradient Background */}
      <Box
        sx={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          background: `radial-gradient(circle at 30% 30%, #002f6c, #000c24)`,
          overflow: "hidden",
          zIndex: -1,
        }}
      >
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 10% 20%, #002f6c, #000c24)",
              "radial-gradient(circle at 80% 70%, #004e92, #001f3f)",
              "radial-gradient(circle at 30% 50%, #001f3f, #000c24)",
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>

      {/* Navbar */}
      <AppBar position="static" color="transparent" sx={{ backdropFilter: "blur(10px)", boxShadow: "none", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <img src="/ProfNITT-logo.png" alt="ProfNITT Logo" style={{ height: 48, marginRight: 16 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#00e5ff" }}>
            Stock Screener
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Container
        maxWidth="sm"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "85vh" }}
      >
        {/* Glass Effect Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={10}
            sx={{
              p: 4,
              mt: 4,
              mb: 4,
              backgroundColor: "rgba(0, 51, 102, 0.55)",
              borderRadius: 4,
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 25px rgba(0, 255, 255, 0.2)",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                letterSpacing: 1,
                mb: 3,
              }}
            >
              Stock Screener
            </Typography>

            {/* Conditions */}
            {conditions.map((cond, idx) => (
              <Box key={idx} sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Field</InputLabel>
                  <Select
                    value={cond.field}
                    label="Field"
                    onChange={(e) => handleConditionChange(idx, "field", e.target.value)}
                  >
                    {fields.map((f) => (
                      <MenuItem key={f.value} value={f.value}>
                        {f.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 80 }}>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={cond.operator}
                    label="Operator"
                    onChange={(e) => handleConditionChange(idx, "operator", e.target.value)}
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
                  sx={{ minWidth: 120 }}
                />

                <IconButton
                  color="secondary"
                  onClick={() => removeCondition(idx)}
                  disabled={conditions.length === 1}
                >
                  <RemoveCircleIcon />
                </IconButton>
                {idx === conditions.length - 1 && (
                  <IconButton color="primary" onClick={addCondition}>
                    <AddCircleIcon />
                  </IconButton>
                )}
              </Box>
            ))}

            {/* Filter Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchStocks}
                sx={{
                  mt: 2,
                  fontWeight: "bold",
                  boxShadow: "0 0 20px rgba(33,150,243,0.4)",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 0 25px rgba(33,150,243,0.7)",
                  },
                }}
                fullWidth
              >
                Filter
              </Button>
            </motion.div>
          </Paper>
        </motion.div>

        {/* Stock Results */}
        {queried && stocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: "100%" }}
          >
            <Box sx={{ mt: 2 }}>
              <StockTable stocks={stocks} />
            </Box>
          </motion.div>
        )}

        {queried && stocks.length === 0 && (
          <Typography align="center" color="secondary" sx={{ mt: 4, fontWeight: "bold" }}>
            No results found.
          </Typography>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
