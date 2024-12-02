import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, PolarArea } from "react-chartjs-2";
import { Card, CardContent, Typography } from "@mui/material";
import { useFileUploadContext } from "../context/FileUploadContext";
import { months, backgroundColor } from "../context/Constans";

// Registrar os componentes necessários para o Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ChartMonthly = () => {
  const { dataMonthly } = useFileUploadContext();
  const currentMonth = new Date().getMonth() + 1;
  const mes = months.find((el) => el.value === currentMonth.toString());

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

    //   // Transformar os dados por categoria (coluna) e ordenar por valores
    //   const transposedData = labels.map((_, index) => {
    // Extrair os valores de cada categoria (coluna)
    const column = datasets[0]?.data.map((dataset, index) => ({
      value: dataset,
      datasetIndex: index,
    }));
    //     // Ordenar os valores de menor para maior
    //     return column.sort((a, b) => a.value - b.value);
    //   });
    const dataSorted = column?.sort((a, b) => a.value - b.value);

    //    // Dados do gráfico
    //    const dataChart = {
    //     labels: labels, // Rótulos do eixo X
    //     datasets: [{
    //       data: dataCategory,
    //       backgroundColor: bgcolor,
    //     }],
    //   };
    //   const transposedData = [];
    //   // Atualizar os datasets com base na nova ordem
    //   const updatedDatasets = datasets.map((dataset, datasetIndex) => ({
    //     ...dataset,
    //     data: dataSorted.map((column) => column.value ),
    //     labels: dataSorted.map((column) => labels[column.datasetIndex] ),
    //   }));

    const dataSetSorted = [];
    const labelsSorted = [];
    const bgcolor = [];

    for (let index in dataSorted) {
      dataSetSorted.push(dataSorted[index].value);
      labelsSorted.push(labels[dataSorted[index].datasetIndex]);
      bgcolor.push(backgroundColor[labels[dataSorted[index].datasetIndex]]);
    }

    const updatedDatasets = {
      labels: labelsSorted,
      datasets: [{ data: dataSetSorted, backgroundColor: bgcolor }],
    };

    return updatedDatasets;
  }

  // Reorganizar os dados dinamicamente
  const organizedData = reorganizeData(dataMonthly);

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
  function formatCurrencyFloat(valor) {
    // Formatação para moeda em português do Brasil (BRL - Real)
    const valorFloat = parseFloat(valor);
    const valorFormatado = new Intl.NumberFormat("pt-BR", {minimumFractionDigits: 2}).format(valorFloat);
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
