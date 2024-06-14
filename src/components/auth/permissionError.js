import { Box, Button, Card, CardContent, CardHeader, Typography } from "@mui/material"
import Link from "next/link"

export const PermissionError = ({ title, error }) => {
    return (
        <Box mt={15} mb={5}>
            <Card>
                <CardHeader title={title} />
                <CardContent>
                    <Typography>{error}</Typography>

                    <Box mt={2} mb={2}>
                        <Button LinkComponent={Link} href="/" color="primary" variant="outline">Back to home</Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}