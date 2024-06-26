"use client";

import useAuth from "@/hooks/useAuth";
import { Box, Button, Card, CardContent, CardHeader, Divider, Stack, TextField } from "@mui/material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
    const { signUp } = useAuth();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [firebaseError, setFirebaseError] = useState('');

    const onSubmit = async (data) => {
        try {
            await signUp(data);
            router.push("/admin/auth/signin")
        } catch (error) {
            console.error("Error signUpg in:", error);
            setFirebaseError(error.message);
        }
    };

    return (
        <Card>
            <CardHeader title="Sign Up" subheader="Welcome! Please enter your details." />
            <CardContent>
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
                    <Box mt={2}>
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
                            <Button type="submit" variant="outlined">Sign Up</Button>
                        </Box>
                        <Box>
                            <Link href="/admin/auth/signin">Sign In</Link>
                        </Box>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
};

export default SignUpForm;
