"use client";

import { DataGridToolbar } from "@/components/dataGrid/toolBar";
import { DB } from "@/config/firebase";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button } from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const getData = async () => {
        setLoading(true)
        const col = collection(DB, "users");
        const snapshot = await getDocs(col);
        setUsers(snapshot.docs.map(doc => {
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

    const handleAddClick = () => {
        router.push(`/admin/dashboard/users/form/new`)
    }

    const handleEditClick = (id) => {
        router.push(`/admin/dashboard/users/form/${id}`)
    }

    const handleDeleteClick = (id) => {
        openDialog({
            title: 'Confirmation ?',
            message: 'Are you sure you want to delete this item?',
            onConfirm: async () => {
                try {
                    const userRef = doc(DB, 'users', id);
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
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
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
            <DataGrid loading={loading} rows={users} columns={columns}
                slots={{
                    toolbar: DataGridToolbar,
                }}
                slotProps={{
                    toolbar: { title: "Users", handleAddClick },
                }}
            />
        </Box>
    );
}
