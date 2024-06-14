"use client";

import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/guards/AuthGuard";
import { Box, Container } from "@mui/material";

export default function AdminAuthLayout({ children }) {
    return (
        <AuthProvider>
            <Container>
                <Box mt={15} mb={5}>
                    {children}
                </Box>
            </Container>
        </AuthProvider>
    );
}
