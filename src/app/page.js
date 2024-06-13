"use client";

import { appName } from "@/utils/setting";
import { Box, Card, CardContent, CardHeader, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        router.push('/vacancies');
    }, [router])

    return (
        <Container>
            <Box mt={25} mb={5}>
                <Card>
                    <CardHeader title={appName} />
                    <CardContent>
                        <Typography>Loading...</Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
