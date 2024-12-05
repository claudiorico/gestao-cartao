import { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Papa from "papaparse";
import axios from "axios";
import { months, selectOptions, backgroundColor } from "./Constans";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/pages/firebase.js";
import { formatCurrency, formatCurrencyFloat } from "../src/auxiliares/functions.js";

export const fileUploadContext = createContext(null);
export const useFileUploadContext = () => useContext(fileUploadContext);

const clientAxios = axios.create({ baseURL: "http://localhost:3080/Cart" });

const FileUploadContext = ({ children }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [dataUpd, setDataUpd] = useState([]);
  const [dataChart, setDataChart] = useState({
    labels: [],
    datasets: [],
  });
  const [dataMonthly, setDataMonthly] = useState({
    labels: [],
    datasets: [],
  });
  const [openDialog, setOpenDialog] = useState({
    open: false,
    type: "create",
    refkey: "",
  });
  const [messageDialog, setMessageDialog] = useState(
    ""
  );
  const [messageObj, setMessage] = useState({severity: '',
    message: ''
  });

  const [session, setSession] = useState({
    user: {
      name: "",
      email: "",
      image: "",
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const userlogin = {
        user: {
          name: currentUser.displayName,
          email: currentUser.email,
          image: currentUser.photoURL,
        },
      };
      console.log(userlogin);
      setSession(userlogin);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const queryInfo = useQuery(["dataCartYear"], () => {
    // Obtém o ano atual
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const selectedYear = 2024;

    let labels = [];
    let refKeys = [];
    let monthIdx = currentMonth;
    if (currentYear === selectedYear) {
      for (let index = 0; index < 12; index++) {
        monthIdx = monthIdx === 0 ? 11 : monthIdx - 1;
        labels[index] = months[monthIdx].label;
        refKeys[index] = { refkey: selectedYear + months[monthIdx].value };
      }
    }

    clientAxios.post(`/YearDetail`, refKeys).then((res) => {
      if (res.data) {
        //Criando um objeto indexado com os dados dos meses
        const objIndex = res.data.reduce((acc, currentValue) => {
          const { reference } = currentValue;
          acc[reference] = currentValue.CartDetails;
          return acc;
        }, {});

        //{ ...cartItems, [productID]: cartItems[productID] - 1 }
        let somaMeses = {};
        refKeys.forEach((ref) => {
          let somaClassObj = {};

          if (ref.refkey in objIndex) {
            selectOptions.forEach((classEl) => {
              let somaClass = 0;
              for (const el in objIndex[ref.refkey]) {
                if (
                  objIndex[ref.refkey][el].Classification.classification ===
                  classEl
                ) {
                  somaClass = somaClass + objIndex[ref.refkey][el].value;
                }
              }
              somaClassObj = {
                ...somaClassObj,
                [classEl]: (somaClassObj[classEl] ?? 0) + somaClass,
              };
            });
            somaMeses = { ...somaMeses, [ref.refkey]: somaClassObj };
          } else {
            selectOptions.forEach((classEl) => {
              somaClassObj = {
                ...somaClassObj,
                [classEl]: 0,
              };
            });
            somaMeses = { ...somaMeses, [ref.refkey]: somaClassObj };
          }
        });

        const dataSets = selectOptions.map((ref) => {
          let dataCategory = [];
          refKeys.forEach((el) => {
            for (const category in somaMeses[el.refkey]) {
              if (category === ref) {
                dataCategory.push(somaMeses[el.refkey][category] ?? 0);
              }
            }
          });
          return {
            label: ref,
            data: dataCategory,
            backgroundColor: backgroundColor[ref],
          };
        });

        // Dados do gráfico
        const dataChart = {
          labels: labels, // Rótulos do eixo X
          datasets: dataSets,
        };
        setDataChart(dataChart);
      }
    });
  });

  const queryMonth = useQuery(["dataMonthly"], () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear().toString();

    clientAxios
      .get(`/CartItems/${currentYear + currentMonth}`)
      .then((res) => {
        console.log(res.data);
        const { CartDetails } = res.data;

        // const reference = currentYear + currentMonth;
        let labels = [];
        // //Criando um objeto indexado com os dados dos meses
        // const objIndex = res.data.reduce((acc, currentValue) => {
        //   // const { reference } = currentValue;

        //   acc[reference] = currentValue;
        //   return acc;
        // }, {});

        // console.log(objIndex);

        let somaClassObj = {};
        const bgcolor = [];
        selectOptions.forEach((classEl, index) => {
          let somaClass = 0;
          for (const el in CartDetails) {
            if (CartDetails[el].Classification.classification === classEl) {
              somaClass = somaClass + CartDetails[el].value;
            }
          }
          somaClassObj = {
            ...somaClassObj,
            [classEl]: (somaClassObj[classEl] ?? 0) + somaClass,
          };
          labels[index] = classEl;
          bgcolor.push(backgroundColor[classEl]);
        });

        let dataCategory = [];
        for (let key in somaClassObj) {
          dataCategory.push(somaClassObj[key] ?? 0);
        }

        // Dados do gráfico
        const dataChart = {
          labels: labels, // Rótulos do eixo X
          datasets: [
            {
              data: dataCategory,
              backgroundColor: bgcolor,
            },
          ],
        };
        setDataMonthly(dataChart);
      })
      .catch((error) => console.log(error));
  });

  function lerArquivo() {
    let idNum = 0;
    if (file) {
      Papa.parse(file, {
        header: true, // Define para converter cada linha em um objeto
        skipEmptyLines: true, // Ignora linhas vazias
        step: (row) => {
          if (
            parseFloat(
              row.data.ValorReal.replace(/\./g, "").replace(",", ".")
            ) > 0
          ) {
            const dataRow = {
              id: idNum++,
              data: row.data.Data,
              descricao: row.data.Descricao,
              valor: formatCurrency(row.data.ValorReal),
              valorReal: row.data.ValorReal,
              classificacao: "Outros",
            };
            setData((prevData) => {
              return [...prevData, dataRow];
            });
          }
        },
        complete: () => {
          sendMessage("success", "Carregamento completo!");
        },
        error: (error) => {
          sendMessage("error", `Erro ao processar o arquivo:, ${error}`);
        },
      });
    }
  }

  const carregarExtrato = useMutation({
    mutationFn: async (refKey) => {
      const resposta = await clientAxios.get(`/CartItems/${refKey}`);
      return resposta.data;
      // console.log('api',resposta);
      // if (resposta.status >= 400) {
      //   throw new Error(`Erro do servidor: ${resposta.statusText}`);
      // }

      // console.log(resposta);

      // const cartData =  resposta.data.Items.map((element) => {
      //     const dataRow = {
      //       id: element.id,
      //       data: element.date,
      //       descricao: element.description,
      //       valor: formatCurrency(element.value),
      //       valorReal: element.value,
      //       classificacao: element.classification.classification,
      //     };

      // })

      // console.log(cartData);
      // return cartData;
    },
    onSuccess: (data) => {
      const elements = data.CartDetails.map((element) => {
        const dataRow = {
          id: element.id,
          data: format(new Date(element.date), "dd/MM/yyyy", { locale: ptBR }),
          descricao: element.description,
          valor: formatCurrencyFloat(element.value),
          valorReal: element.value,
          classificacao: element.Classification.classification,
        };
        return dataRow;
      });
      setDataUpd(elements);
    },
    onError: (error) => {
      console.error("Erro:", error);
      sendMessage("error", error.response.data);
    },
  });

  const gravarItems = useMutation({
    mutationFn: async (obj) => {
      const { year, month } = obj;
      const totalValue = data.reduce((acc, obj) => {
        return (acc =
          acc +
          parseFloat(
            parseFloat(
              obj.valorReal.replace(/\./g, "").replace(",", ".")
            ).toFixed(2)
          ));
      }, 0);
      // const ItemsArray = [];
      const ItemsArray = data.map((it) => {
        return {
          date: it.data,
          description: it.descricao,
          value: parseFloat(
            it.valorReal.replace(/\./g, "").replace(",", ".")
          ).toFixed(2),
          classification: it.classificacao,
        };
      });
      const newCartItems = {
        cart: {
          header: {
            reference: year + month,
            totalvalue: totalValue,
          },
          Items: ItemsArray,
        },
      };
      const result = clientAxios.post("/CartItemIns", newCartItems);
      await queryClient.invalidateQueries({
        queryKey: ["dataCartYear"],
        refetchType: "active",
        refetchActive: true,
        refetchInactive: false,
      });
      queryClient.refetchQueries(["dataCartYear"]);      
      return result;
    },
  });

  const atualizarItems = useMutation({
    mutationFn: async (obj) => {
      const { year, month } = obj;
      const totalValue = dataUpd.reduce((acc, obj) => {
        return (acc = acc + obj.valorReal);
      }, 0);
      // const ItemsArray = [];
      const ItemsArray = dataUpd.map((it) => {
        return {
          date: it.data,
          description: it.descricao,
          value: it.valorReal,
          classification: it.classificacao,
        };
      });
      const newCartItems = {
        cart: {
          header: {
            reference: year + month,
            totalvalue: totalValue,
          },
          Items: ItemsArray,
        },
      };
      const result = clientAxios.put("/CartItemsUpd", newCartItems);
      await queryClient.invalidateQueries({
        queryKey: ["dataCartYear"],
        refetchType: "active",
        refetchActive: true,
        refetchInactive: false,
      });
      queryClient.refetchQueries(["dataCartYear"]);
      return result;
    },
  });

  const deletarItem = useMutation({
    mutationFn: async (itemId) => {
      const resposta = await clientAxios.delete(`/CartDetailItem/${itemId}`);
      if (resposta.status >= 400) {
        throw new Error(`Erro do servidor: ${resposta.statusText}`);
      }
      console.log(resposta);
      const updatedRows = dataUpd.filter((row) => row.id !== itemId);
      setDataUpd(updatedRows);
      return resposta.data;
    },
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("Erro:", error);
    },
  });

  const deletarRefKey = useMutation({
    mutationFn: async (refKey) => {
      const refExist = await getRefKey(refKey);
      if (refExist > 0) {
        const countDeleted = await clientAxios.delete(`/ItemsDetail/${refKey}`);
        if (countDeleted.status < 400) {
          sendMessage("success", countDeleted.data.resposta);
        } else {
          sendMessage("error", countDeleted.data.resposta);
        }
        console.log(countDeleted);
      } else {
        sendMessage(
          "error",
          `Não há extrato gravado com essa referência: ${refKey}`
        );
      }
    },
  });

  const ifRefExist = useMutation({
    // mutationFn: async (refKey) => {
    //   const resposta = await clientAxios.get(`/CheckRefKey/${refKey}`);
    //   return resposta.data;
    // },
    mutationFn: async (refKey) => getRefKey(refKey),
  });

  async function getRefKey(refKey) {
    const resposta = await clientAxios.get(`/CheckRefKey/${refKey}`);
    return resposta.data;
  }

  function sendMessage(msgty, msg) {
    setMessage({
      severity: msgty,
      message: msg,
    });
  }

   return (
    <>
      <fileUploadContext.Provider
        value={{
          file,
          setFile,
          lerArquivo,
          gravarItems,
          data,
          setData,
          messageObj,
          sendMessage,
          ifRefExist,
          openDialog,
          setOpenDialog,
          carregarExtrato,
          formatCurrency,
          dataUpd,
          setDataUpd,
          deletarItem,
          deletarRefKey,
          atualizarItems,
          messageDialog,
          setMessageDialog,
          dataChart,
          dataMonthly,
          queryMonth,
          queryInfo,
          session,
          setSession,
          loading,
          setLoading,
        }}
      >
        {children}
      </fileUploadContext.Provider>
    </>
  );
};

export default FileUploadContext;
