// import * as React from 'react';
import React, { useState, useMemo, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { getEquivalencia } from '../../../services/equivalencia_service';
import { getUsuario } from '../../../services/usuario_service';
// import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
// import { OuterFormButtons } from '../../../OuterFormButtons';
import FormHelperText from '@mui/material/FormHelperText';
import { useFormControl } from '@mui/material/FormControl';

// import TextField from '@mui/material/TextField';
// import Stack from '@mui/material/Stack';
// import Autocomplete from '@mui/material/Autocomplete';
// import { getEquivalencia } from './services/equivalencia_service';

export const columns = [
    { id: 'solicitante', label: 'Solicitante', minWidth: 170 },
    { id: 'dni', label: 'DNI', minWidth: 100 },
    { id: 'materia', label: 'Materia', minWidth: 170 },
    { id: 'dateTime', label: 'Fecha y Hora', minWidth: 100 },
    { id: 'actions', label: 'Acciones', minWidth: 170 }
];

function createData(solicitante, dni, materia, dateTime) {
    const actions = <Button>Revisar</Button>; //acciones lleva a pantalla revision de ese id
    return { solicitante, dni, materia, dateTime, actions };
}
function MyFormHelperText() {
    const { focused } = useFormControl() || {};

    const helperText = useMemo(() => {
        if (focused) {
            return 'This field is being focused';
        }

        return 'Helper text';
    }, [focused]);

    return <FormHelperText>{helperText}</FormHelperText>;
}

const horaConCero = (hora) => {
    if (hora < 10) {
        return `0${hora}`;
    } else {
        return hora;
    }
};

export default function StickyHeadTable({ searchQuery }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = useState([]);
    const [arrayData, setArrayData] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // const [searchQuery, setSearchQuery] = useState('');
    // console.log(searchQuery);

    useEffect(() => {
        const fetchEquivalenciaData = async () => {
            const obtainedEquivalenciaData = await getEquivalencia();
            const obtainedUsuarioData = await getUsuario(7);
            let array = [];

            obtainedEquivalenciaData.forEach(function (arrayItem) {
                let d = new Date(arrayItem.Materias_solicitadas[0].createdAt); //tengo que traer solicitantes
                let e = new Date(obtainedUsuarioData.createdAt);
                let dateTime =
                    // d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();
                    d.getDate() +
                    '/' +
                    (d.getMonth() + 1) +
                    '/' +
                    d.getFullYear() +
                    ' - ' +
                    d.getHours() +
                    ':' +
                    horaConCero(d.getMinutes());

                array.push(
                    createData(
                        // arrayItem.Materias_solicitadas[0].nombre ----falta esto
                        // arrayItem.Materias_solicitadas[0].Usuario.id,
                        // arrayItem.Materias_solicitadas[0].usuario.dni,
                        // arrayItem.Materias_solicitadas[0].id,
                        obtainedUsuarioData.nombre,
                        obtainedUsuarioData.dni,
                        arrayItem.Materias_solicitadas[0].nombre,
                        // arrayItem.Materias_solicitadas[0],
                        dateTime //fecha actual de cuando se genero la equivalencia
                        // arrayItem.Estado[0].status
                    )
                );
                const dataFilter = array.filter(
                    (d) => d.solicitante.includes(searchQuery)
                    // console.log(d.solicitante, "desde filter")
                );

                if (searchQuery) {
                    setRows(dataFilter);
                } else {
                    setRows([...array]);
                }
            });
            console.log(arrayData);
        };
        fetchEquivalenciaData();
    }, [searchQuery]);
    console.log(arrayData);

    // function search(arrayData, setRows) {
    //     const dataFilter = arrayData.filter(
    //         (d) => d.solicitante.includes(searchQuery)
    //         // console.log(d.solicitante, "desde filter")
    //     );

    //     if (searchQuery) {
    //         setRows(dataFilter);
    //     }
    // }

    return (
        <Paper
            sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: '10px',
                boxShadow: 'none'
            }}
        >
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
