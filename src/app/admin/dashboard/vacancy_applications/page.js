"use client";

import { DB } from "@/config/firebase";
import { useConfirmationDialog } from "@/context/ConfirmationDialogContext";
import CancelIcon from '@mui/icons-material/CancelOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DoneIcon from '@mui/icons-material/DoneOutline';
import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Page() {
    const { openDialog } = useConfirmationDialog();
    const [loading, setLoading] = useState(false);
    const [vacancies, setVacancies] = useState([]);

    const getData = async () => {
        setLoading(true);
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
        setLoading(false);
    }

    useEffect(() => {
        getData()
    }, [])


    const handleRejectClick = (id) => {
        openDialog({
            title: 'Confirmation ?',
            message: 'Are you sure you want to reject this item?',
            onConfirm: async () => {
                try {
                    const docRef = doc(DB, 'vacancy_applications', id);
                    await updateDoc(docRef, { status: "reject" });
                    getData()
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            },
            onCancel: () => {
                console.log('reject canceled');
            },
        });
    }

    const handleCompleteClick = (id) => {
        openDialog({
            title: 'Confirmation ?',
            message: 'Are you sure you want to complete this item?',
            onConfirm: async () => {
                try {
                    const docRef = doc(DB, 'vacancy_applications', id);
                    await updateDoc(docRef, { status: "complete" });
                    getData()
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            },
            onCancel: () => {
                console.log('complete canceled');
            },
        });
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
        { field: 'status', headerName: 'Status', width: 200 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {

                return [
                    <GridActionsCellItem
                        key={`reject-${id}`}
                        icon={<CancelIcon />}
                        label="Reject"
                        className="textPrimary"
                        onClick={() => handleRejectClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={`complete-${id}`}
                        icon={<DoneIcon />}
                        label="Complete"
                        className="textPrimary"
                        onClick={() => handleCompleteClick(id)}
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
            <DataGrid loading={loading} rows={vacancies} columns={columns} />
        </Box>
    );
}
