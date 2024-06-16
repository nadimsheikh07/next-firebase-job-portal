import AddIcon from '@mui/icons-material/AddOutlined';
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import PropTypes from 'prop-types';

export const DataGridToolbar = ({ title, handleAddClick }) => {
    return (
        <GridToolbarContainer>
            <AppBar position='static' color='inherit' sx={{ marginBottom: 1, }}>
                <Toolbar>
                    {title && <Typography sx={{ flexGrow: 1 }} color="inherit" noWrap variant='h6' component="h1">{title}</Typography>}
                    {handleAddClick && <Button color="primary" variant="outlined" startIcon={<AddIcon />} onClick={() => handleAddClick()}>
                        Add record
                    </Button>}
                </Toolbar>
            </AppBar>
        </GridToolbarContainer>
    );
}

DataGridToolbar.propTypes = {
    title: PropTypes.string,
    handleAddClick: PropTypes.func
}
DataGridToolbar.defaultProps = {
    title: "",
    handleAddClick: null
}