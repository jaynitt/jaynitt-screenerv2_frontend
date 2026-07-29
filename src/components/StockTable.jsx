import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";

const MotionRow = motion(TableRow);

export default function StockTable({ stocks }) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        width: "100%",
        backgroundColor: "rgba(0, 51, 102, 0.4)",
        borderRadius: 4,
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 0 30px rgba(0, 200, 255, 0.12)",
      }}
    >
      <Table sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            <TableCell sx={{ color: "#00e5ff", fontWeight: "bold", py: 2 }}>Symbol</TableCell>
            <TableCell sx={{ color: "#00e5ff", fontWeight: "bold", py: 2 }}>
              Market Price
              <br />
              in Rs
            </TableCell>
            <TableCell sx={{ color: "#00e5ff", fontWeight: "bold", py: 2 }}>
              Market Cap
              <br />
              in Cr
            </TableCell>
            <TableCell sx={{ color: "#00e5ff", fontWeight: "bold", py: 2 }}>PE Ratio</TableCell>
            <TableCell sx={{ color: "#00e5ff", fontWeight: "bold", py: 2 }}>Book Value</TableCell>
            <TableCell sx={{ color: "#00e5ff", fontWeight: "bold", py: 2 }}>
              Dividend
              <br />
              Rate (%)
            </TableCell>
            <TableCell sx={{ color: "#00e5ff", fontWeight: "bold", py: 2 }}>
              Return on
              <br />
              Equity (%)
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {stocks.map((stock, idx) => (
            <MotionRow
              key={stock.symbol || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.6) }}
              whileHover={{
                backgroundColor: "rgba(0, 229, 255, 0.08)",
                scale: 1.01,
              }}
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <TableCell sx={{ color: "#fff", py: 1.8 }}>
                {(stock.symbol || "").replace(".NS", "")}
              </TableCell>
              <TableCell sx={{ color: "rgba(255,255,255,0.85)", py: 1.8 }}>
                {stock.regularmarketprice}
              </TableCell>
              <TableCell sx={{ color: "rgba(255,255,255,0.85)", py: 1.8 }}>
                {stock.marketcap ? Math.ceil(stock.marketcap / 1000000) : "-"}
              </TableCell>
              <TableCell sx={{ color: "rgba(255,255,255,0.85)", py: 1.8 }}>
                {stock.trailingpe || "-"}
              </TableCell>
              <TableCell sx={{ color: "rgba(255,255,255,0.85)", py: 1.8 }}>
                {stock.bookvalue || "-"}
              </TableCell>
              <TableCell sx={{ color: "rgba(255,255,255,0.85)", py: 1.8 }}>
                {stock.dividendrate || "-"}
              </TableCell>
              <TableCell sx={{ color: "rgba(255,255,255,0.85)", py: 1.8 }}>
                {stock.returnonequity || "-"}
              </TableCell>
            </MotionRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
