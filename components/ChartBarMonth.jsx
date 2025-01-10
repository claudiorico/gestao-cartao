import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, Typography } from "@mui/material";
import { useFileUploadContext } from "../context/FileUploadContext";
import { months } from "../context/Constans";
import {reorganizeDataMonth} from "../src/auxiliares/functions.js";
import { formatCurrencyFloat } from "../src/auxiliares/functions.js";

// Registrar os componentes necessários para o Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ChartMonthly = () => {
  const { dataMonthly } = useFileUploadContext();
  const currentMonth = new Date().getMonth() + 1;
  const mes = months.find((el) => el.value === currentMonth.toString().padStart(2, "0"));

  
  // Reorganizar os dados dinamicamente
  const organizedData = reorganizeDataMonth(dataMonthly);

  // Opções do gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false, // Remove a legenda
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            // Formatar os números no tooltip
            const value = context.raw; // Valor do dado
            return new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value); // Formatar como moeda brasileira
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
    layout: {
        padding: {
          top: 20, // Espaço no topo
          bottom: 20, // Espaço na parte inferior
        },
      },    
  };

  // Plugin para exibir os valores totais no topo de cada coluna
  const totalPlugin = {
    id: "totalPlugin",
    afterDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart;

      // Iterar sobre cada coluna (categoria)
      chart.data.labels.forEach((_, index) => {
        // Calcular o total da coluna
        const total = chart.data.datasets.reduce(
          (sum, dataset) => sum + dataset.data[index],
          0
        );

        // Determinar a posição no topo da coluna
        const x = scales.x.getPixelForValue(index);
        const y = scales.y.getPixelForValue(total);

        // Desenhar o total no canvas
        ctx.save();
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(formatCurrencyFloat(total), x, y - 5); // Ajustar posição vertical acima da coluna
        ctx.restore();
      });
    },
  };

  return (
    <Card sx={{ maxWidth: '72%', height: '100%', margin: "5px auto", padding: "10px" }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Gastos do Cartão {mes.label}
        </Typography>
          <Bar data={organizedData} options={options} plugins={[totalPlugin]} />
      </CardContent>
    </Card>
  );
};

export default ChartMonthly;
