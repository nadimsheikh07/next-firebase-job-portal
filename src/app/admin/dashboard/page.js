"use client";

import { DB } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { Typography } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';

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

            <BarChart
                xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                width={500}
                height={300}
            />
        </>
    );
}
