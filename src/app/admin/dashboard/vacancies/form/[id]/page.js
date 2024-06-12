"use client";

import { DB } from "@/config/firebase";
import { Box, Button, TextField } from "@mui/material"
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form"

export default function Page({ params }) {
    const { id } = params
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        if (id == "new") {
            const docRef = collection(DB, 'vacancies');
            await addDoc(docRef, data);
        } else {
            const docRef = doc(DB, 'vacancies', id);
            await updateDoc(docRef, data);
        }
        router.push('/admin/dashboard/vacancies')
    }

    const getData = async () => {
        const docRef = doc(DB, 'vacancies', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log('docSnap data:', docSnap.data());
            for (const [key, value] of Object.entries(docSnap.data())) {
                setValue(key, value);
            }
        } else {
            console.log('No such document!');
        }
    }

    useEffect(() => {
        if (id != "new") {
            getData()
        }
    }, [])

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>

                <Box mt={2} mb={2}>
                    <TextField variant="outlined" label="Title" defaultValue="" {...register("title", { required: "Title is required" })} fullWidth error={errors.title} helperText={errors.title && errors.title.message}
                    />
                </Box>

                <Box mt={2} mb={2}>
                    <TextField variant="outlined" label="Location" defaultValue="" {...register("location", { required: "Location is required" })} fullWidth error={errors.location} helperText={errors.location && errors.location.message} />
                </Box>

                <Button variant="outlined" type="submit">Submit</Button>
            </form>
        </Box>
    )
}