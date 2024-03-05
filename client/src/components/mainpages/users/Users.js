import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import renderRoleCell from './Role';
import renderRoleEditCell from './RoleEdit';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { ListItemText } from '@mui/material';
import "./users.css"
import { Button } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const roleRollOptions = () => [0, 1, 2];
const ROLE_OPTIONS = [{
    key: 'Membre',
    value: 0
}, {
    key: 'Admin',
    value: 1
}, {
    key: 'Professionnel',
    value: 2
}];
const useStyles = makeStyles(
    (theme) =>
        createStyles({
            select: {
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '5px',
            },
            optionIcon: {
                minWidth: 36,
            },
            optionText: {
                overflow: 'hidden',
            },
        })
);

function Users() {
    const state = useContext(GlobalState)
    const [products, setProducts] = state.productsAPI.products
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [callback, setCallback] = state.productsAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const [rows, setRows] = useState([])
    const [modifiedRole, setModifiedRole] = useState(0)
    const [deletedRows, setDeletedRows] = useState([]);
    const classes = useStyles();

    const columns = [
        { field: '_id', headerName: 'ID', width: 230 },
        { field: 'email', headerName: 'Email', width: 230 },
        { field: 'username', headerName: 'Username', flex: 0.2 },
        { field: 'name', headerName: 'Name', flex: 0.2 },
        {
            field: 'role',
            headerName: 'Role',
            flex: 0.2,
            // generateData: roleRollOptions,
            renderCell: renderRoleCell,
            renderEditCell: renderRoleEditCell,
            editable: true
        },
        { field: 'DateNaissance', headerName: 'Date de Naissance', flex: 0.2, valueFormatter: p => `${p.value ? p.value.substring(0, 10) : ''}` },
        { field: 'createdAt', headerName: 'Rejoint au', flex: 0.2, valueFormatter: p => `${p.value ? p.value.substring(0, 10) : ''}` }
    ]
    var data = {
        columns: columns,
        rows: rows
    }

    const deleteUser = async () => {
        let u = deletedRows.map(u => u._id);
        await axios.post('/user/deletemany', { users: u }, {

            headers: { Authorization: token }
        }
        )
            .then(
                res => {
                    toast.success("Utilisateurs supprimés avec succès", { position: toast.POSITION.BOTTOM_CENTER })
                }
            ).catch(err => {
                toast.error(err.response.data.msg, { position: toast.POSITION.BOTTOM_CENTER })
            });
    }

    const updateUser = async () => {
        let u = deletedRows.map(u => u._id);
        console.log(u)
        await axios.put(`/user/${u[0]}/role`, { role: modifiedRole }, {

            headers: { Authorization: token }
        }
        )
            .then(
                res => {
                    toast.success("Role Modifié avec succès", { position: toast.POSITION.TOP_RIGHT })
                }
            ).catch(err => {
                toast.error(err.response.data.msg, { position: toast.POSITION.BOTTOM_CENTER })
            });
        console.log("hahaha")
    }

    const getUsers = async () => {
        await axios.get('/user/all',
            { headers: { Authorization: token } }
        )
            .then(
                res => {
                    setRows(res.data.map((u, i) => {
                        u.id = i;
                        return u;
                    }));
                }
            ).catch(err => {
                toast.error('Erreur. Essayez de rafraîchir la page.', { position: toast.POSITION.BOTTOM_CENTER })
            });
    }

    useEffect(() => {
        getUsers();
    }, []);

    if (loading) return <div><Loading /></div>
    return (
        <>
            {/* <div style={{ height: 400, width: '100%' }}>
                <DataGrid  />
            </div> */}
            <div style={{ height: 520, width: '100%' }}>
                <DataGrid
                    {...data}
                    loading={data.rows.length === 0}
                    rowHeight={38}
                    checkboxSelection
                    disableSelectionOnClick
                    onSelectionModelChange={({ selectionModel }) => {
                        const rowIds = selectionModel.map(rowId => parseInt(String(rowId), 10));
                        const rowsToDelete = rows.filter(row => rowIds.includes(row.id));
                        setModifiedRole(0);
                        setDeletedRows(rowsToDelete);
                    }}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                />
            </div>
            {
                isAdmin && deletedRows && deletedRows.length > 0 &&
                
                <div className="btnr">
                    <Select className="sel"
                    style={{'margin-right': '0.4rem'}}
                    value={modifiedRole}
                    classes={{ select: classes.select }}
                    autoFocus
                    onChange={e => {
                        console.log(e.target)
                        setModifiedRole(e.target.value);
                    }}
                    >   
                        {ROLE_OPTIONS.map((option) => {
                            return (
                                <MenuItem key={option.value} value={option.value}>
                                    <ListItemText className={classes.optionText} primary={option.key} />
                                </MenuItem>
                            );
                        })}
                    </Select>
                     <Button style={{'margin-right': '2rem'}} className="btnr" variant="contained" color="primary" onClick={updateUser}>Modifier le role</Button>
                    <Button className="btnr" variant="contained" color="secondary" onClick={deleteUser}>Supprimer les utilisaterus selectionnés</Button>
                    </div>
            }
        </>
    )
}

export default Users
