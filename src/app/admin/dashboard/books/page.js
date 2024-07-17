"use client";

import { DataGridToolbar } from "@/components/dataGrid/toolBar";
import { Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import AplClient from "@/hooks/ApolloClient";

const GET_BOOKS = gql`
  query GetBooks {
    books {
      title
      author
    }
  }
`;

export default function Page() {
    const { loading, error, data } = useQuery(GET_BOOKS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


    const columns = [
        { field: 'title', headerName: 'title', width: 200 },
        { field: 'author', headerName: 'author', width: 200 },
    ];

    return (
        <ApolloProvider client={AplClient}>
            <Box>
                <DataGrid loading={loading} rows={data.books} columns={columns}
                    slots={{
                        toolbar: DataGridToolbar,
                    }}
                    slotProps={{
                        toolbar: { title: "Books" },
                    }}
                />
            </Box>
        </ApolloProvider>
    );
}
