"use client";

import { DB } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {

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

    return (
        <>
            <div className="container mx-auto mt-8 max-w-[560px]">
                <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
                    <h1 className="text-3xl font-semibold">vacancies</h1>
                </div>
                <ul>
                    {vacancies.map((task) => (
                        <li key={task.id} className="py-2 flex justify-between w-full">
                            <span>
                                <strong>{task.name}</strong> - {task.description}
                            </span>
                            <span className="flex gap-2">
                                <Link className="text-blue-700 underline hover:no-underline" href={`/${task.id}/edit`}>Edit</Link>
                                <Link className="text-red-500 underline hover:no-underline" href={`/${task.id}/delete`}>Delete</Link>
                            </span>
                        </li>
                    ))}
                    {vacancies?.length < 1 && <div className="py-2">No data</div>}
                </ul>
            </div>
            <Head>
                <title>Vacancies</title>
            </Head>
        </>
    );
}
