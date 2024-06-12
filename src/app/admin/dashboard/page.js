"use client";

import { DB } from "@/config/firebase";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Typography } from "@mui/material";

export default function Page() {

    const [users, setUsers] = useState([]);

    const getData = async () => {
        const col = collection(DB, "users");
        const snapshot = await getDocs(col);
        setUsers(snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        }));
    }

    useEffect(() => {
        getData()
    }, [])


    return (
        <>
            <Typography>Dashboard</Typography>
        </>
    );
}
