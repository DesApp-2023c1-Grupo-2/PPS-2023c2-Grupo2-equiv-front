import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
// import { ActionButtons } from '../../../ActionButtons';
import { getEquivalencia } from '../../../services/equivalencia_service';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import SearchBar from 'material-ui-search-bar';
// import TextField from '@mui/material/TextField';
// import Stack from '@mui/material/Stack';
// import Autocomplete from '@mui/material/Autocomplete';

export const columns = [
    { id: 'solicitante', label: 'Solicitante', minWidth: 170 },
    { id: 'dni', label: 'Dni', minWidth: 170 },
    { id: 'dateTime', label: 'Fecha y hora', minWidth: 100 },
    { id: 'actions', label: 'Acciones', minWidth: 170 }
];

function createData(solicitante, dateTime, dni) {
    const actions = <Button>Revisar</Button>; //acciones lleva a pantalla revision de ese id
    return { solicitante, dateTime, dni, actions };
}

export default function StickyHeadTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        const fetchEquivalenciaData = async () => {
            const obtainedEquivalenciaData = await getEquivalencia();
            let arrayData = [];

            obtainedEquivalenciaData.forEach(function (arrayItem) {
                let d = new Date(arrayItem.Materias_solicitadas[0].createdAt); //tengo que traer solicitantes
                let dateTime =
                    d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();

                arrayData.push(
                    createData(
                        arrayItem.Materias_solicitadas[0].nombre,
                        // arrayItem.Materias_solicitada[0].dni,
                        dateTime
                        // arrayItem.Estado[0].status
                    )
                );
            });

            setRows(arrayData);
            console.log(obtainedEquivalenciaData);
        };

        fetchEquivalenciaData();
    }, []);

    return (
        <Paper
            sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: '10px',
                boxShadow: 'none'
            }}
        >
            {/* <SearchBar
                value={searched}
                onChange={(searchVal) => requestSearch(searchVal)}
                onCancelSearch={() => cancelSearch()}
            /> */}
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{
                                        backgroundColor: '#FBFBFB',
                                        padding: '16px 60px'
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.code}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    sx={{
                                                        padding: '16px 60px'
                                                    }}
                                                >
                                                    {column.format &&
                                                    typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
