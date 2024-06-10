"use client";

import useAuth from "@/hooks/useAuth";
import { Box, Button, Divider, Stack, TextField } from "@mui/material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";

const SignInForm = () => {
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [firebaseError, setFirebaseError] = useState('');

    const onSubmit = async (data) => {
        try {
            console.log(data, "form");
            const response =await login(data.email, data.password);
            console.log('response',response)
        } catch (error) {
            console.error("Error signing in:", error);
            setFirebaseError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box mt={2}>
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

            <Box mt={2}>
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

            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} mt={2}>
                <Box>
                    <Button type="submit" variant="outlined">Sign In</Button>
                </Box>
                <Box>
                    <Link href="/admin/auth/signup">Sign Up</Link>
                </Box>
            </Stack>
        </form>
    );
};

export default SignInForm;
