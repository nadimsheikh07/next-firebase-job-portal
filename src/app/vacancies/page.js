"use client";

import { DB } from "@/config/firebase";
import useAuth from "@/hooks/useAuth";
import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, Container, Grid, Typography } from "@mui/material";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [firebaseError, setFirebaseError] = useState('');
    const [firebaseSuccess, setFirebaseSuccess] = useState('');

    const router = useRouter()
    const { isAuthenticated, user } = useAuth()

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

    const applyVacancy = async (vacancy) => {
        if (isAuthenticated) {
            try {
                const collectionRef = collection(DB, 'vacancy_applications');
                const q = query(collectionRef, where('user', '==', user.id), where('vacancy', '==', vacancy.id));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    const data = {
                        user: user.id,
                        vacancy: vacancy.id,
                    };
                    await addDoc(collectionRef, data);
                    setFirebaseSuccess("Application submitted successfully");
                } else {
                    setFirebaseError("Application already exists for this user and vacancy");
                }
            } catch (error) {
                console.error("Error submitting application:", error);
                setFirebaseError(error.message);
            }
        } else {
            router.push('/admin/auth/signin')
        }
    }

    return (
        <Container>

            {firebaseError && (
                <Box mt={2} mb={2}>
                    <Alert severity="error">{firebaseError}</Alert>
                </Box>
            )}
            
            {firebaseSuccess && (
                <Box mt={2} mb={2}>
                    <Alert severity="success">{firebaseSuccess}</Alert>
                </Box>
            )}

            <Grid container spacing={2}>
                {vacancies && vacancies.map((vacancy, index) => (
                    <Grid key={`vacancy-${index}`} item xs={12} sm={12} md={4} lg={4}>
                        <Card>
                            <CardHeader title={vacancy.title} />
                            <CardContent>
                                <Typography>{vacancy.description}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="outlined" onClick={() => applyVacancy(vacancy)}>Apply</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
