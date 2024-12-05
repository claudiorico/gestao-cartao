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
import { formatCurrencyFloat } from "../src/auxiliares/functions";


// Registrar os componentes necessários para o Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = () => {

  const { dataChart } = useFileUploadContext();
 
  // Reorganizar os dados dinamicamente
  // const organizedData = reorganizeData(dataChart);

  // Opções do gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          
          font: { size: 8, family: 'Aria' }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
            label: (context) => {
              // Formatar os números no tooltip
              console.log("tooltip", context);
              const value = context.raw; // Valor do dado
              const label = context.dataset.label || "";
              const valorFormated = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value); // Formatar como moeda brasileira
              return `${label}: ${valorFormated}`;
            }
        }        
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
  };

  // Plugin para exibir os valores totais no topo de cada coluna
  const totalPlugin = {
    id: "totalPlugin",
    afterDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart;

      // Iterar sobre cada coluna (categoria)
      chart.data.labels.forEach((_, index) => {
        // Calcular o total da coluna
        const total = chart.data.datasets.reduce((sum, dataset) => sum + dataset.data[index], 0);

        // Determinar a posição no topo da coluna
        const x = scales.x.getPixelForValue(index);
        const y = scales.y.getPixelForValue(total);

        // Desenhar o total no canvas
        ctx.save();
        ctx.font = "bold 10px sans-serif";
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
        <Typography variant="h6" component="div" gutterBottom>
          Histórico de gastos no Cartão
        </Typography>
        <Bar data={dataChart} options={options} plugins={[totalPlugin]}/>
      </CardContent>
    </Card>
  );
};

export default BarChart;
