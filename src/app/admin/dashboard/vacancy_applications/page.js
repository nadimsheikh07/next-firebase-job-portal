"use client";

import { DB } from "@/config/firebase";
import { useConfirmationDialog } from "@/context/ConfirmationDialogContext";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button } from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const { openDialog } = useConfirmationDialog();

    const [vacancies, setVacancies] = useState([]);

    const getData = async () => {
        const col = collection(DB, 'vacancy_applications');
        const snapshot = await getDocs(col);

        const vacancyApplications = [];

        for (const value of snapshot.docs) {
            const { user, vacancy, ...restData } = value.data();

            const userDoc = await getDoc(doc(DB, 'users', user));
            const vacancyDoc = await getDoc(doc(DB, 'vacancies', vacancy));

            if (userDoc.exists() && vacancyDoc.exists()) {
                const userData = { id: userDoc.id, ...userDoc.data() };
                const vacancyData = { id: vacancyDoc.id, ...vacancyDoc.data() };

                vacancyApplications.push({
                    id: value.id,
                    user: `${userData.firstName} ${userData.lastName}`,
                    vacancy: vacancyData.title,
                    ...restData
                });
            }
            
        }

        setVacancies(vacancyApplications)
    }

    useEffect(() => {
        getData()
    }, [])

    const handleNewClick = () => {
        router.push(`/admin/dashboard/vacancy_applications/form/new`)
    }

    const handleEditClick = (id) => {
        router.push(`/admin/dashboard/vacancy_applications/form/${id}`)
    }

    const handleDeleteClick = (id) => {
        openDialog({
            title: 'Confirmation ?',
            message: 'Are you sure you want to delete this item?',
            onConfirm: async () => {
                try {
                    const userRef = doc(DB, 'vacancy_applications', id);
                    await deleteDoc(userRef);
                    getData()
                    console.log(`User with UID: ${id} has been deleted.`);
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            },
            onCancel: () => {
                console.log('Delete canceled');
            },
        });


    }

    const columns = [
        { field: 'user', headerName: 'User', width: 200 },
        { field: 'vacancy', headerName: 'Vacancy', width: 200 },
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

            <DataGrid rows={vacancies} columns={columns} />
        </Box>
    );
}
