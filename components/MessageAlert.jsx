import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useFileUploadContext } from '../context/FileUploadContext';

function SnackbarAlert() {

    const { messageObj } = useFileUploadContext();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(true);
    }, [ messageObj ])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            { messageObj.message && 
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={messageObj.severity} sx={{ width: '100%' }}>
                    {messageObj.message}
                </Alert>
            </Snackbar> }
        </>
    );
}

export default SnackbarAlert;
