"use client";

import { DB } from "@/config/firebase";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function Page() {
    const router = useRouter();

    const [vacancies, setVacancies] = useState([]);

    const getData = async () => {
        const col = collection(DB, "vacancies");
        const snapshot = await getDocs(col);
        setVacancies(snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        }));
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

    const handleDeleteClick = async (id) => {
        try {
            const userRef = doc(DB, 'vacancies', id);
            await deleteDoc(userRef);
            getData()
            console.log(`User with UID: ${id} has been deleted.`);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    const columns = [
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'location', headerName: 'location', width: 150 },
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
        <>
            <Button onClick={() => handleNewClick()}>New</Button>
            <DataGrid rows={vacancies} columns={columns} />
        </>
    );
}
