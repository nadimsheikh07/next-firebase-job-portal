"use client";

import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/guards/AuthGuard";
import { AdminDrawer } from "@/layout/admin/drawer";
import AdminMenuAppBar from "@/layout/admin/header";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

export default function AdminDashboardLayout({ children }) {

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <AuthProvider>
            <AuthGuard>
                <Box sx={{ display: 'flex' }}>

                    <CssBaseline />

                    <AdminMenuAppBar open={open} handleDrawerOpen={handleDrawerOpen} />

                    <AdminDrawer open={open} handleDrawerClose={handleDrawerClose} />

                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <DrawerHeader />
                        {children}
                    </Box>
                </Box>

            </AuthGuard>
        </AuthProvider>
    );
}
