import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import BarChart from "../../components/ChartBar.jsx";
import ChartMonthly from "../../components/ChartBarMonth.jsx";
import { useFileUploadContext } from "../../context/FileUploadContext.jsx";
import estilos from "./../css/ButtonNavegation.module.css";
import PolarAreaChart from "../../components/ChartPolarArea.jsx";

export default function PageContainer() {
  //   const { queryInfo } = useFileUploadContext();

  //     console.log(queryInfo);
  //   if (queryInfo.isLoading) return "Carregando...";
  //   if (queryInfo.error) return <div>Error: {queryInfo.error.message}</div>;

  let selectItem = 0;

  function handleButtonLeft(event) {
    const carrossel = document.getElementById("carrossel__imagens");
    console.log(carrossel);
    selectItem += 1;
    if (selectItem >= 2) {
      selectItem = 2;
    }
    // carrossel.classList.toggle(estilos.carrossel__move);
    carrossel.style = "transform: translateX(-" + selectItem * 100 + "%)";
  }

  function handleButtonRight(event) {
    // const carrossel = document.getElementById("carrossel__imagens");
    // carrossel.classList.toggle(estilos.carrossel__move);
    const carrossel = document.getElementById("carrossel__imagens");
    console.log(carrossel);
    selectItem -= 1;
    if (selectItem <= 0) {
      selectItem = 0;
    }
    carrossel.style = "transform: translateX(-" + selectItem * 100 + "%)";
  }
  return (
    <>
      <div className={estilos.carrossel}>
        <button
          className={`${estilos.button__navagation} ${estilos.button__navagation_left}`}
          onClick={handleButtonLeft}
        >
          &#8249;
        </button>
        <button
          className={`${estilos.button__navagation} ${estilos.button__navagation_right}`}
          onClick={handleButtonRight}
        >
          &#8250;
        </button>
        <div className={estilos.carrossel__imagens} id="carrossel__imagens">
          <Box
            sx={{
              flexBasis: "100%",
              flexShrink: 0,
              // height: "100%",
              backgroundColor: "#add8e6",
            }}
          >
            <BarChart />
          </Box>
          <Box
            sx={{
              flexBasis: "100%",
              flexShrink: 0,
              // height: "100%",
              backgroundColor: "#add8e6",
            }}
          >
            <ChartMonthly />
          </Box>
          <Box
            sx={{
              flexBasis: "100%",
              flexShrink: 0,
              // height: "100%",
              backgroundColor: "#add8e6",
            }}
          >
            <PolarAreaChart />
          </Box>
        </div>
      </div>

      {/* <Box
        sx={{
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            //   justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            overflowX: "auto",
            scrollBehavior: "smooth",
            transform: "translateX(-60%)",
          }}
          //   style={"transform: translateX(-100%)"}
        >
          {/* Gráfico 1 }
          <Box
            sx={{
              flexBasis: "100%",
              flexShrink: 0,
              height: "100%",
              backgroundColor: "#ffcccb",
            }}
          >
            <BarChart />
          </Box>
          <Box
            sx={{
              flexBasis: "100%",
              flexShrink: 0,
              height: "100%",
              backgroundColor: "#add8e6",
            }}
          >
            <ChartMonthly />
          </Box>
        </Box>
      </Box> */}
    </>
  );
}
