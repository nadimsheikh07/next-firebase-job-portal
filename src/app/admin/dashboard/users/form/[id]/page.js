"use client";

import { AUTH, DB } from "@/config/firebase";
import { Box, Button, Stack, TextField } from "@mui/material";
import { createUserWithEmailAndPassword, updateCurrentUser, updatePassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page({ params }) {
    const { id } = params
    const router = useRouter()
    const [firebaseError, setFirebaseError] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: ''
        }
    })

    const onSubmit = async (data) => {
        try {
            if (id == "new") {
                const res = await createUserWithEmailAndPassword(AUTH, data.email, data.password);

                if (res && res.user) {
                    const docRef = doc(collection(DB, 'users'), res.user.uid);

                    await setDoc(docRef, {
                        uid: res.user.uid,
                        email: data.email,
                        firstName: data.firstName,
                        lastName: data.lastName
                    });
                }
            } else {
                const docRef = doc(DB, 'users', id);
                await updateDoc(docRef, data);
            }
            router.push('/admin/dashboard/users')
        } catch (error) {
            console.error("Error signUpg in:", error);
            setFirebaseError(error.message);
        }
    }

    const getData = async () => {
        const docRef = doc(DB, 'users', id);
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
                    <TextField
                        label="Email"
                        variant="outlined"
                        id="email"
                        type="email"
                        fullWidth
                        {...register("email", { required: "Email is required" })}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ''}
                    />
                </Box>

                <Box mt={2} mb={2}>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        id="firstName"
                        type="text"
                        fullWidth
                        {...register("firstName", { required: "First Name is required" })}
                        error={!!errors.firstName}
                        helperText={errors.firstName ? errors.firstName.message : ''}
                    />
                </Box>

                <Box mt={2} mb={2}>
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        id="lastName"
                        type="text"
                        fullWidth
                        {...register("lastName", { required: "Last Name is required" })}
                        error={!!errors.lastName}
                        helperText={errors.lastName ? errors.lastName.message : ''}
                    />
                </Box>
                
                <Box mt={2} mb={2}>
                    <TextField
                        label="Phone Number"
                        variant="outlined"
                        id="phoneNumber"
                        type="text"
                        fullWidth
                        {...register("phoneNumber", { required: "Phone Number is required" })}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
                    />
                </Box>

                <Box mt={2} mb={2}>
                    <TextField
                        label="Password"
                        variant="outlined"
                        id="password"
                        type="password"
                        fullWidth
                        {...register("password", { required: "Password is required" })}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password.message : ''}
                    />
                </Box>

                {firebaseError && (
                    <Box mt={2}>
                        <p style={{ color: 'red' }}>{firebaseError}</p>
                    </Box>
                )}

                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" type="submit">Submit</Button>
                    <Button variant="outlined" color="error" component={Link} href="/admin/dashboard/users">Cancel</Button>
                </Stack>
            </form>
        </Box>
    )
}