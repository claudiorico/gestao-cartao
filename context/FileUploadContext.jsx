import { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Papa from "papaparse";
import axios from "axios";
import { months, selectOptions, backgroundColor } from "./Constans";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/pages/firebase.js";
import {
  formatCurrency,
  formatCurrencyFloat,
} from "../src/auxiliares/functions.js";

export const fileUploadContext = createContext(null);
export const useFileUploadContext = () => useContext(fileUploadContext);
 
const baseUrl = import.meta.env.VITE_api_url;
const clientAxios = axios.create({ baseURL: baseUrl });

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
  const [messageDialog, setMessageDialog] = useState("");
  const [messageObj, setMessage] = useState({
    severity: "",
    message: "",
  });

  const [session, setSession] = useState({
    user: {
      name: null,
      email: null,
      image: null,
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userlogin = {
          user: {
            name: currentUser.displayName,
            email: currentUser.email,
            image: currentUser.photoURL,
          },
        };
        setSession(userlogin);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const queryInfo = useQuery(["dataCartYear"], () => {
    // Obtém o ano atual
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    let selectedYear = 2024;

    let labels = [];
    let refKeys = [];
    let monthIdx = currentMonth;
    if (currentYear === selectedYear) {
      for (let index = 0; index < 12; index++) {
        monthIdx = monthIdx === 0 ? 11 : monthIdx - 1;
        if (monthIdx === 11) {
          selectedYear -= 1;
        }
        labels[index] = months[monthIdx].label;
        refKeys[index] = { refkey: selectedYear + months[monthIdx].value };
      }
    }

    if (!session.user.name || !session.user) {
      return;
    }

    clientAxios
      .post(`/YearDetail/${session.user.email}`, refKeys)
      .then((res) => {
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

    if (!session.user.name) {
      return;
    }

    clientAxios
      .get(`/CartItems/${currentYear + currentMonth}/${session.user.email}`)
      .then((res) => {
        const { CartDetails } = res.data;

        if (!CartDetails) {
          return;
        }

        let labels = [];
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

  function lerArquivo( newfile = null ) {
    let idNum = 0;
    let fileOrigem = file;
    if(newfile){
      fileOrigem = newfile;
    }
    if (fileOrigem) {
      Papa.parse(fileOrigem, {
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
          sendMessage("error", `Erro ao processar o arquivo:, ${error.message }`);
        },
      });
    }
  }

  const carregarExtrato = useMutation({
    mutationFn: async (refKey) => {
      const resposta = await clientAxios.get(
        `/CartItems/${refKey}/${session.user.email}`
      );
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
      console.log(data);
      if(!data.CartDetails){
        return sendMessage("success", "Registro não encontrado!" );
      }
      const elements = data.CartDetails.map((element) => {
        const fixedDate = parseISO(element.date);
        const dataRow = {
          id: element.id,
          data: format(fixedDate, "dd/MM/yyyy", { locale: ptBR }),
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
      sendMessage("error", error.message );
    },
  });

  const gravarItems = useMutation({
    mutationFn: async (obj) => {
      console.log("data", data);

      let Items = obj?.items ? obj?.items : data;

      const { year, month } = obj;
      const totalValue = Items.reduce((acc, obj) => {
        return (acc =
          acc +
          parseFloat(
            parseFloat(
              obj.valorReal.replace(/\./g, "").replace(",", ".")
            ).toFixed(2)
          ));
      }, 0);
      // const ItemsArray = [];
      const ItemsArray = Items.map((it) => {
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
          user: {
            name: session.user.name,
            email: session.user.email,
          },
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
        return (acc = acc + parseFloat(obj.valorReal));
      }, 0);

      //Separar os itens que são novos para fazer o INSERT
      const ItemsArrayIns = dataUpd
        .filter((it) => it.id > 900)
        .map((it) => {
          return {
            date: it.data,
            description: it.descricao,
            value: it.valorReal,
            classification: it.classificacao,
          };
        });

      // Itens de update
      const ItemsArray = dataUpd
        .filter((it) => it.id < 900)
        .map((it) => {
          return {
            date: it.data,
            description: it.descricao,
            value: it.valorReal,
            classification: it.classificacao,
          };
        });
      console.log(ItemsArrayIns);
      if (ItemsArrayIns) {
        const newCartItemsIns = {
          cart: {
            user: {
              name: session.user.name,
              email: session.user.email,
            },
            header: {
              reference: year + month,
              totalvalue: totalValue,
            },
            Items: ItemsArrayIns,
          },
        };
        const resultIns = clientAxios.post("/CartItemIns", newCartItemsIns);
      }

      const newCartItems = {
        cart: {
          user: {
            name: session.user.name,
            email: session.user.email,
          },
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
        const countDeleted = await clientAxios.delete(
          `/ItemsDetail/${refKey}/${session.user.email}`
        );
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
    console.log(refKey);
    const resposta = await clientAxios.get(
      `/CheckRefKey/${refKey}/${session.user.email}`
    );
    console.log(resposta.data);
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
