import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, Typography } from "@mui/material";
import { useFileUploadContext } from "../context/FileUploadContext";
import { months } from "../context/Constans";
import { reorganizeDataPolar } from "../src/auxiliares/functions.js"

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const options = {
  plugins: {
    legend: {
      display: false,
      position: "top",
    },
  },
  scales: {
    r: {
      ticks: {
        color: "#000",
      },
      grid: {
        color: "rgba(200, 200, 200, 0.3)",
      },
    },
  },
};

const PolarAreaChart = () => {
  const { dataMonthly } = useFileUploadContext();
  const currentMonth = new Date().getMonth() + 1;
  const mes = months.find((el) => el.value === currentMonth.toString().padStart(2, "0"));

  // Reorganizar os dados dinamicamente
  const organizedData = reorganizeDataPolar(dataMonthly);

  return (
    <Card
      sx={{
        maxWidth: "50%",
        height: "100%",
        margin: "5px auto",
        padding: "10px",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Gastos do Cartão {mes.label}
        </Typography>
        <PolarArea data={organizedData} options={options} />
      </CardContent>
    </Card>
  );
};

export default PolarAreaChart;
