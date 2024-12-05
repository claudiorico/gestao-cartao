import { backgroundColor } from "../../context/Constans";

// Função para reorganizar os dados dinamicamente
export function reorganizeData(data) {
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

// Função para reorganizar os dados dinamicamente
export function reorganizeDataMonth(data) {
    const { labels, datasets } = data;

    const column = datasets[0]?.data.map((dataset, index) => ({
        value: dataset,
        datasetIndex: index,
    }));

    // Ordenar os valores de menor para maior
    const dataSorted = column?.sort((a, b) => a.value - b.value);

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

// Função para reorganizar os dados dinamicamente
export function reorganizeDataPolar(data) {
    const { labels, datasets } = data;

    const column = datasets[0]?.data.map((dataset, index) => ({
        value: dataset,
        datasetIndex: index,
    }));

    const dataSorted = column?.sort((a, b) => a.value - b.value);

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
        datasets: [
            { data: dataSetSorted, backgroundColor: bgcolor, borderColor: bgcolor },
        ],
    };

    return updatedDatasets;
}

export function formatCurrency(valor) {
    // Formatação para moeda em português do Brasil (BRL - Real)
    const valorFloat = parseFloat(valor.replace(/\./g, "").replace(",", "."));
    const valorFormatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorFloat);
    return valorFormatado;
  }

  export function formatCurrencyFloat(valor) {
    // Formatação para moeda em português do Brasil (BRL - Real)
    const valorFloat = parseFloat(valor);
    const valorFormatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorFloat);
    return valorFormatado;
  }