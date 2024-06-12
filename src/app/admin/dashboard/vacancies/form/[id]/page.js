"use client";

import { DB } from "@/config/firebase";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page({ params }) {
    const [firebaseError, setFirebaseError] = useState('');

    const { id } = params
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            location: '',
            description: ''
        }
    })

    const onSubmit = async (data) => {
        try {
            if (id == "new") {
                const docRef = doc(DB, 'vacancies');
                await addDoc(docRef, data);
            } else {
                const docRef = doc(DB, 'vacancies', id);
                await updateDoc(docRef, data);
            }
            router.push('/admin/dashboard/vacancies')
        } catch (error) {
            console.error("Error signUpg in:", error);
            setFirebaseError(error.message);
        }
    }

    const getData = async () => {
        const docRef = doc(DB, 'vacancies', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
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

                <Box mt={2} mb={2}>
                    <TextField variant="outlined" label="Description" defaultValue="" {...register("description", { required: "Description is required" })} fullWidth error={errors.description} helperText={errors.description && errors.description.message} />
                </Box>

                {firebaseError && (
                    <Box mt={2} mb={2}>
                        <Alert severity="error">{firebaseError}</Alert>
                    </Box>
                )}
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" type="submit">Submit</Button>
                    <Button variant="outlined" color="error" component={Link} href="/admin/dashboard/vacancies">Cancel</Button>
                </Stack>
            </form>
        </Box>
    )
}