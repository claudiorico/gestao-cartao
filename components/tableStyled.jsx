import { styled } from "@mui/material/styles";
import {
    TableCell,
    TableRow,
    Select,
    tableCellClasses
  } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const CustomSelect = styled(Select)({
    width: 200, // Ajusta a largura
    height: 40, // Ajusta a altura
    fontSize: 14, // Tamanho da fonte
  });