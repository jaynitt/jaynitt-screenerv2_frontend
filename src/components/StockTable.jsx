import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

export default function StockTable({ stocks }) {
  return (
   <TableContainer component={Paper} elevation={0}>
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor: '#E6E1F2' }}>
        <TableCell sx={{ color: '#2a003f', fontWeight: 'bold' }}>Symbol</TableCell>
        <TableCell sx={{ color: '#2a003f', fontWeight: 'bold' }}>Market Price in Rs</TableCell>
        <TableCell sx={{ color: '#2a003f', fontWeight: 'bold' }}>Market Cap in Cr</TableCell>
        <TableCell sx={{ color: '#2a003f', fontWeight: 'bold' }}>PE Ratio</TableCell>
        <TableCell sx={{ color: '#2a003f', fontWeight: 'bold' }}>Book Value</TableCell>
        <TableCell sx={{ color: '#2a003f', fontWeight: 'bold' }}>Dividend Rate</TableCell>
        <TableCell sx={{ color: '#2a003f', fontWeight: 'bold' }}>Return on Equity</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {stocks.map((stock) => (
        <TableRow
          key={stock.symbol}
          sx={{ backgroundColor: '#FFFFFF' }}
        >
          <TableCell sx={{ color: '#2a003f' }}>
            {stock.symbol.replace('.NS', '')}
          </TableCell>
          <TableCell sx={{ color: '#2a003f' }}>{stock.regularmarketprice}</TableCell>
          <TableCell sx={{ color: '#2a003f' }}>
            {Math.ceil(stock.marketcap / 100000)}
          </TableCell>
          <TableCell sx={{ color: '#2a003f' }}>{stock.trailingpe}</TableCell>
          <TableCell sx={{ color: '#2a003f' }}>{stock.bookvalue}</TableCell>
          <TableCell sx={{ color: '#2a003f' }}>{stock.dividendrate}</TableCell>
          <TableCell sx={{ color: '#2a003f' }}>{stock.returnonequity}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

  );
}