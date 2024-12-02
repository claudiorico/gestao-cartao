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
import { selectOptions } from "../context/Constans";


// Registrar os componentes necessários para o Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
// ChartJS.defaults.plugins.tooltip.titleFont = () => ({ size: 20, lineHeight: 1.2, weight: 800 });

const BarChart = () => {

  const { dataChart } = useFileUploadContext();
  // Dados do gráfico
//   const data = {
//     labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"], // Rótulos do eixo X
//     datasets: [
//       {
//         label: "Produto A",
//         data: [30, 50, 70],
//         backgroundColor: "rgba(75, 192, 192, 0.7)",
//       },
//       {
//         label: "Produto B",
//         data: [40, 60, 90],
//         backgroundColor: "rgba(153, 102, 255, 0.7)",
//       },
//       {
//         label: "Produto C",
//         data: [20, 80, 60],
//         backgroundColor: "rgba(255, 159, 64, 0.7)",
//       },
//     ],
//   };

// Função para reorganizar os dados dinamicamente
function reorganizeData(data) {
    const { labels, datasets } = data;
  
    // Transformar os dados por categoria (coluna) e ordenar por valores
    const transposedData = labels.map((_, index) => {
      // Extrair os valores de cada categoria (coluna)
      const column = datasets.map((dataset) => ({
        value: dataset.data[index],
        datasetIndex: datasets.indexOf(dataset),
      }));
      // Ordenar os valores de menor para maior
      return column.sort((a, b) => a.value - b.value);
    });
    // Atualizar os datasets com base na nova ordem
    const updatedDatasets = datasets.map((dataset, datasetIndex) => ({
      ...dataset,
      data: transposedData.map((column) => {
        const found = column.find((item) => item.datasetIndex === datasetIndex);
        return found ? found.value : 0; // Reinsere o valor correspondente
      }),
    }));
  
    return { labels, datasets: updatedDatasets };
  }
  
  // Reorganizar os dados dinamicamente
  const organizedData = reorganizeData(dataChart);

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
  function formatCurrencyFloat(valor) {
    // Formatação para moeda em português do Brasil (BRL - Real)
    const valorFloat = parseFloat(valor);
    const valorFormatado = new Intl.NumberFormat("pt-BR").format(valorFloat);
    return valorFormatado;
  }
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
