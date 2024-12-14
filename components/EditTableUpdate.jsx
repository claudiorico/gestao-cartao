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
  IconButton,
} from "@mui/material";
import { useFileUploadContext } from "../context/FileUploadContext";
import ConfirmationDialog from "./ConfirmationDialog.jsx";
import { useState } from "react";
import style from "../src/css/CssSelectField.module.css";
import {
  StyledTableCell,
  StyledTableRow,
  CustomSelect,
} from "./tableStyled.jsx";
import { selectOptions, months } from "../context/Constans.js";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { formatCurrencyFloat } from "../src/auxiliares/functions.js";

const EditTableUpdate = () => {
  const {
    ifRefExist,
    setOpenDialog,
    carregarExtrato,
    dataUpd,
    setDataUpd,
    deletarItem,
    deletarRefKey,
    setMessageDialog,
    setData,
    gravarItems,
    sendMessage
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
    const newData = [...dataUpd];
    newData[index][field] = value;
    setDataUpd(newData);
  };

  function handleLoadData() {
    carregarExtrato.mutate(selectedYear + selectedMonth);
  }

  function createItems() {
    setData([...dataUpd]);
    gravarItems.mutate(
      { year: selectedYear, month: selectedMonth, items: dataUpd },
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
  }

  function handleUpdItems() {
    ifRefExist.mutate(selectedYear + selectedMonth, {
      onSuccess: (data) => {
        console.log(data);
        if (data) {
          console.log(months[Number(selectedMonth) - 1].label, selectedYear);
          setMessageDialog(
            `Gostaria de Atualizar os registros, referente ao mês ${months[Number(selectedMonth) - 1].label} do ano ${selectedYear}`
          );
          setOpenDialog({
            open: true,
            type: "update",
            refkey: selectedYear + selectedMonth,
          });
        } else {
          createItems();
        }
      },
      onError: (error) => {
        console.error("Erro:", error);
      },
    });
  }

  // Função para deletar uma linha específica
  const handleDelete = (id) => {
    deletarItem.mutate(id);
  };

  const handleDeleteData = () => {
    deletarRefKey.mutate(selectedYear + selectedMonth);
  };

  // Novo registro
  const [newRow, setNewRow] = useState({
    data: "",
    descricao: "",
    valor: "",
    classificacao: "",
  });

  // Função para adicionar uma nova linha
  const addRow = () => {
    if (
      newRow.data &&
      newRow.descricao &&
      newRow.valor &&
      newRow.classificacao
    ) {
      setDataUpd([
        ...dataUpd,
        {
          ...newRow,
          id: 900 + (dataUpd?.length + 1),
          valor: formatCurrencyFloat(newRow.valor),
          valorReal: newRow.valor,
        },
      ]);
      console.log(dataUpd);
      setNewRow({ data: "", descricao: "", valor: "", classificacao: "" }); // Limpa os campos
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <TableContainer component={Paper} style={{ overflowY: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
              onClick={handleLoadData}
            >
              Carregar Extrato
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "10px" }}
              onClick={handleDeleteData}
            >
              Deletar Extrato
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "10px" }}
              onClick={handleUpdItems}
            >
              Atualizar Items
            </Button>
          </Box>
        </Box>

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
              <StyledTableCell>Ação</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell>{newRow.id}</StyledTableCell>
              <StyledTableCell>
                <TextField
                  label="Data"
                  variant="outlined"
                  size="small"
                  value={newRow.data}
                  onChange={(e) =>
                    setNewRow({ ...newRow, data: e.target.value })
                  }
                  placeholder="dd/MM/yyyy"
                  sx={{ mr: 1 }}
                ></TextField>
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  label="Descrição"
                  variant="outlined"
                  size="small"
                  value={newRow.descricao}
                  onChange={(e) =>
                    setNewRow({ ...newRow, descricao: e.target.value })
                  }
                  sx={{ mr: 1 }}
                ></TextField>
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  label="Valor"
                  variant="outlined"
                  size="small"
                  value={newRow.valor}
                  onChange={(e) =>
                    setNewRow({ ...newRow, valor: e.target.value })
                  }
                  sx={{ mr: 1 }}
                ></TextField>
              </StyledTableCell>
              <StyledTableCell>
                <CustomSelect
                  id="classificacao"
                  value={newRow.classificacao}
                  label="Classificação"
                  onChange={(e) =>
                    setNewRow({ ...newRow, classificacao: e.target.value })
                  }
                >
                  {selectOptions.map((op) => (
                    <MenuItem key={op} value={op}>
                      {op}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </StyledTableCell>
              <StyledTableCell align="center">
                <IconButton
                  aria-label="success"
                  color="success"
                  onClick={addRow}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>

            {dataUpd.map((row, index) => (
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
                <StyledTableCell align="center">
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleDelete(row.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EditTableUpdate;
