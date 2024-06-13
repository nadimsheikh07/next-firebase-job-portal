"use client";

import { AuthProvider } from "@/context/AuthContext";
import WebsiteHeader from "@/layout/website/header";
import { Box, Container, CssBaseline } from "@mui/material";

export default function AppLayout({ children }) {
    return (
        <AuthProvider>
            <CssBaseline />
            <WebsiteHeader />
            <Container>
                <Box mt={5} mb={5}>
                    {children}
                </Box>
            </Container>
        </AuthProvider>
    );
}
