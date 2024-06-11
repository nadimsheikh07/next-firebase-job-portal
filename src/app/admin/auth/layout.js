"use client";

import { AuthProvider } from "@/context/AuthContext";
import { Box, Container } from "@mui/material";

export default function AdminAuthLayout({ children }) {
    return (
        <AuthProvider>
            <Container>
                <Box mt={5} mb={5}>
                    {children}
                </Box>
            </Container>
        </AuthProvider>
    );
}
