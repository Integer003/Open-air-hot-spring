// ConfirmDialog.tsx
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: React.ReactNode;
    message?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onConfirm, onCancel, title, message }) => (
    <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="confirm-dialog-title"
    >
        <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {message}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onConfirm} color="primary">
                确认
            </Button>
            <Button onClick={onCancel} color="primary">
                取消
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDialog;