import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { useFileUploadContext } from '../context/FileUploadContext';

function ConfirmationDialog() {

    const { openDialog, setOpenDialog, messageDialog, deletarRefKey, sendMessage, gravarItems, atualizarItems } = useFileUploadContext();

    // Abre o diálogo
    const handleOpen = () => {
        setOpenDialog(true);
    };

    // Fecha o diálogo
    const handleClose = () => {
        setOpenDialog(false);
    };

    // Ação de confirmação
    const handleConfirm = () => {
        // Coloque aqui a ação a ser executada quando o usuário confirmar
        if(openDialog.type === 'create'){
            deletarRefKey.mutate(openDialog.refkey,{
                onSuccess: () => {
                    console.log('passou aqui');
                    gravarItems.mutate(
                        { year: openDialog.refkey.substring(4,0), month: openDialog.refkey.substring(4) },
                        {
                          onSuccess: (resposta) => {
                            sendMessage("success", resposta.data);
                          },
                          onError: (error) => {
                            console.error("Erro:", error);
                          },
                        }
                      );
                  },
                  onError: (error) => {
                    console.error("Erro:", error);
                  },
            })
        } else if (openDialog.type === 'update') {
            atualizarItems.mutate({ year: openDialog.refkey.substring(4,0), month: openDialog.refkey.substring(4) }, 
            { onSuccess: (resposta) => {
                console.log(resposta);
                sendMessage("success", resposta.data);
            }})
        }

        handleClose(); // Fecha o diálogo após a confirmação
    };

    return (
        <>
            <Dialog open={openDialog.open} onClose={handleClose}>
                <DialogTitle>Confirmação</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {messageDialog}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm} color="primary" autoFocus>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ConfirmationDialog;
