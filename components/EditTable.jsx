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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from '@mui/icons-material/Save';
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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

  function handleLoadFileButton(event) {
    console.log(event.target.files[0]);
    lerArquivo(event.target.files[0]);
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
      <TableContainer component={Paper} style={{ overflowY: "hidden" }} sx={{height: {
        sm: 150,
        md: 300,
        lg: 500
      }}}>
        {uploadActive && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* <MuiFileInput
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
                },
              }}
            /> */}

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{
                width: 300,
                // marginTop: 2,
                // marginBottom: "10px",
                "& .MuiInputBase-input": {
                  padding: "10px",
                  color: "#1976d2", // Altera a cor do texto do arquivo
                  fontWeight: "bold", // Personalização extra
                },
              }}
            >
              Carregar Arquivo
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => handleLoadFileButton(event)}
                multiple
              />
            </Button>

            <TextField
              className={style.SelectField}
              id="outlined-select-year"
              select
              label="Selecionar o Ano"
              defaultValue={selectedYear}
              onChange={handleYearChange}
              sx={{
                width: 150,
                margin: "10px",
                // marginTop: 2,
                "& .MuiInputBase-input": {
                  padding: "10px",
                  color: "#1976d2", // Altera a cor do texto do arquivo
                  fontWeight: "bold", // Personalização extra
                },
                // "& .MuiSelect-root": {
                //   marginTop: "0",
                // },
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
                margin: "10px",
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
              {/* <Button
                variant="contained"
                color="primary"
                style={{ margin: "10px" }}
                onClick={handleLoadFile}
              >
                Carregar Arquivo
              </Button> */}
              <Button
                variant="contained"
                color="primary"
                // style={{  }}
                onClick={handleAddItems}
                startIcon={<SaveIcon />}
                sx={{
                  width: 300,
                  // marginBottom: "10px",
                  // marginTop: 2,
                  "& .MuiInputBase-input": {
                    padding: "10px",
                    color: "#1976d2", // Altera a cor do texto do arquivo
                    fontWeight: "bold", // Personalização extra
                  },
                }}
              >
                Salvar Modificações
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
