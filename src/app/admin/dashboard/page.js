"use client";

import { DB } from "@/config/firebase";
import { DataGrid } from '@mui/x-data-grid';
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

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

    const columns = [
        { field: 'displayName', headerName: 'Display Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
    ];

    return (
        <>
            <DataGrid rows={users} columns={columns} />
        </>
    );
}
