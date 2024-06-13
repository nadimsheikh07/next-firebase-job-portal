import AlertDialog from '@/components/dialog/AlertDialog';
import { createContext, useState, useContext } from 'react';

const ConfirmationDialogContext = createContext();

export const useConfirmationDialog = () => {
    return useContext(ConfirmationDialogContext);
};

export const ConfirmationDialogProvider = ({ children }) => {

    const [dialogState, setDialogState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => { },
    });

    const openDialog = ({ title, message, onConfirm, onCancel }) => {
        setDialogState({
            isOpen: true,
            title,
            message,
            onConfirm,
            onCancel,
        });
    };

    const closeDialog = () => {
        setDialogState({ ...dialogState, isOpen: false });
    };

    return (
        <ConfirmationDialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}

            <AlertDialog open={dialogState.isOpen} title={dialogState.title} message={dialogState.message} onConfirm={() => { dialogState.onConfirm(); closeDialog(); }} onCancel={() => { dialogState.onCancel(); closeDialog(); }} />

        </ConfirmationDialogContext.Provider>
    );
};
