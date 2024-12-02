import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Paper,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { useFileUploadContext } from "../context/FileUploadContext";
import ConfirmationDialog from "./ConfirmationDialog.jsx";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";
import style from "../src/css/CssSelectField.module.css";
import { selectOptions, months } from "../context/Constans.js";
import {
  StyledTableCell,
  StyledTableRow,
  CustomSelect,
} from "./tableStyled.jsx";

const EditTable = ({ uploadActive = false }) => {
  const {
    data,
    setData,
    file,
    setFile,
    lerArquivo,
    gravarItems,
    sendMessage,
    ifRefExist,
    setOpenDialog,
    queryInfo
  } = useFileUploadContext();

  // Obtém o ano atual
  const currentYear = new Date().getFullYear();

  // Estado para armazenar o ano selecionado
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Gera a lista de anos (ex: dos últimos 50 anos até o ano atual)
  const years = Array.from(new Array(15), (v, i) => currentYear + (10 - i));

  // Função para manipular a mudança de ano selecionado
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Estado para armazenar o mês selecionado
  const [selectedMonth, setSelectedMonth] = useState("01");

  // Função para manipular a mudança de mês selecionado
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleEdit = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  function handleFileChange(newFile) {
    setFile(newFile);
  }

  function handleLoadFile() {
    lerArquivo();
  }

  function handleAddItems() {
    ifRefExist.mutate(selectedYear + selectedMonth, {
      onSuccess: (data) => {
        if (!data) {
          gravarItems.mutate(
            { year: selectedYear, month: selectedMonth },
            {
              onSuccess: (resposta) => {
                console.log(resposta);
                sendMessage("success", resposta.data);
              },
              onError: (error) => {
                console.error("Erro:", error);
              },
            }
          );
        } else {
          setOpenDialog(true);
        }
      },
      onError: (error) => {
        console.error("Erro:", error);
      },
    });
  }

  return (
    <>
      <ConfirmationDialog />
      <TableContainer component={Paper} style={{ overflowY: "hidden" }}>
        {uploadActive && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MuiFileInput
              style={{ margin: "10px" }}
              label="Caminho do Arquivo:"
              value={file}
              onChange={handleFileChange}
              inputProps={{
                accept: ".csv",
              }} // Define tipos de arquivos permitidos
              // slotProps={{
              //   input: {
              //     startAdornment: (
              //       <IconButton edge="start">
              //       <AttachFileIcon />
              //     </IconButton>
              //     ),
              //   },
              // }}
              sx={{
                width: 300,
                marginTop: 2,
                "& .MuiInputBase-input": {
                  padding: "10px",
                  color: "#1976d2", // Altera a cor do texto do arquivo
                  fontWeight: "bold", // Personalização extra
                }
              }}
            />
            <TextField
              className={style.SelectField}
              id="outlined-select-year"
              select
              label="Selecionar o Ano"
              defaultValue={selectedYear}
              onChange={handleYearChange}
              sx={{
                width: 150,
                // marginTop: 2,
                "& .MuiInputBase-input": {
                  padding: "10px",
                  color: "#1976d2", // Altera a cor do texto do arquivo
                  fontWeight: "bold", // Personalização extra
                },
                "& .MuiSelect-root": {
                  marginTop: "0",
                },
              }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="outlined-select-month"
              select
              label="Selecionar a Mês"
              defaultValue={selectedMonth}
              onChange={handleMonthChange}
              className="custom-select"
              sx={{
                width: 150,
                // marginTop: 2,
                "& .MuiInputBase-input": {
                  padding: "10px",
                  color: "#1976d2", // Altera a cor do texto do arquivo
                  fontWeight: "bold", // Personalização extra
                },
              }}
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </TextField>
            <Box>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "10px" }}
                onClick={handleLoadFile}
              >
                Carregar Arquivo
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "10px" }}
                onClick={handleAddItems}
              >
                Adicionar Item
              </Button>
            </Box>
          </Box>
        )}

        <Table
          sx={{ minWidth: 600 }}
          aria-label="customized table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Data</StyledTableCell>
              <StyledTableCell>Descrição</StyledTableCell>
              <StyledTableCell>Valor(R$)</StyledTableCell>
              <StyledTableCell>Classificação</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.id}</StyledTableCell>
                <StyledTableCell>{row.data}</StyledTableCell>
                <StyledTableCell>{row.descricao}</StyledTableCell>
                <StyledTableCell>{row.valor}</StyledTableCell>
                <StyledTableCell>
                  <CustomSelect
                    id="classificacao"
                    value={row.classificacao}
                    label="Classificação"
                    onChange={(e) =>
                      handleEdit(index, "classificacao", e.target.value)
                    }
                  >
                    {selectOptions.map((op) => (
                      <MenuItem key={op} value={op}>
                        {op}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EditTable;
