import AddIcon from '@mui/icons-material/AddOutlined';
import RefreshIcon from '@mui/icons-material/RefreshOutlined';
import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import PropTypes from 'prop-types';

export const DataGridToolbar = ({ title, handleAddClick, handleRefreshClick }) => {
    return (
        <GridToolbarContainer>
            <AppBar position='static' color='inherit' sx={{ marginBottom: 1, }}>
                <Toolbar>
                    {title && <Typography sx={{ flexGrow: 1 }} color="inherit" noWrap variant='h6' component="h1">{title}</Typography>}

                    <Stack spacing={2} direction="row">
                        {handleAddClick && <Button color="primary" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddClick()}>
                            Add record
                        </Button>}
                        {handleRefreshClick && <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={() => handleRefreshClick()}>
                            Refresh
                        </Button>}
                    </Stack>
                </Toolbar>
            </AppBar>
        </GridToolbarContainer>
    );
}

DataGridToolbar.propTypes = {
    title: PropTypes.string,
    handleAddClick: PropTypes.func,
    handleRefreshClick: PropTypes.func,
}

DataGridToolbar.defaultProps = {
    title: "",
    handleAddClick: null,
    handleRefreshClick: null
}