"use client";

import { DB } from "@/config/firebase";
import { appName } from "@/utils/setting";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Container, Grid, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Page() {

    const [vacancies, setVacancies] = useState([]);

    const getData = async () => {
        const col = collection(DB, "vacancies");
        const snapshot = await getDocs(col);
        setVacancies(snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        }));
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <Container>
            <Box mt={5} mb={5}>
                <Typography>{appName}</Typography>
            </Box>
            <Grid container spacing={2}>
                {vacancies && vacancies.map((vacancy, index) => (
                    <Grid key={`vacancy-${index}`} item xs={12} sm={12} md={4} lg={4}>
                        <Card>
                            <CardHeader title={vacancy.title} />
                            <CardContent>
                                <Typography>{vacancy.description}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button>Apply</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
