"use client";

import { DB } from "@/config/firebase";
import { useConfirmationDialog } from "@/context/ConfirmationDialogContext";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button } from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const { openDialog } = useConfirmationDialog();
    const [loading, setLoading] = useState(false);

    const [vacancies, setVacancies] = useState([]);

    const getData = async () => {
        setLoading(true)
        const col = collection(DB, "vacancies");
        const snapshot = await getDocs(col);
        setVacancies(snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        }));
        setLoading(false)
    }

    useEffect(() => {
        getData()
    }, [])

    const handleNewClick = () => {
        router.push(`/admin/dashboard/vacancies/form/new`)
    }

    const handleEditClick = (id) => {
        router.push(`/admin/dashboard/vacancies/form/${id}`)
    }

    const handleDeleteClick = (id) => {
        openDialog({
            title: 'Confirmation ?',
            message: 'Are you sure you want to delete this item?',
            onConfirm: async () => {
                try {
                    const userRef = doc(DB, 'vacancies', id);
                    await deleteDoc(userRef);
                    getData()
                } catch (error) {
                    console.error('Error deleting:', error);
                }
            },
            onCancel: () => {
                console.log('Delete canceled');
            },
        });
    }

    const columns = [
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'location', headerName: 'Location', width: 200 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {

                return [
                    <GridActionsCellItem
                        key={`edit-${id}`}
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={() => handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={`delete-${id}`}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        }
    ];

    return (
        <Box>
            <Box mb={2}>
                <Button variant="outlined" onClick={() => handleNewClick()}>Create</Button>
            </Box>

            <DataGrid loading={loading} rows={vacancies} columns={columns} />
        </Box>
    );
}
