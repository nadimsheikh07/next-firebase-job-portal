import { Box, Container } from "@mui/material";

export default function AdminAuthLayout({ children }) {
    return (
        <Container>
            <Box mt={5} mb={5}>
                {children}
            </Box>
        </Container>
    );
}
