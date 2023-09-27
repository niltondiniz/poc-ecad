import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { RegionInfo } from '../interfaces/region-info.interface';
import { formatTime } from '../utils/helpers';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

interface Props {
    regions: RegionInfo[];
    playRegion: any;
    setTimeToRegion: any;
}

export default function CustomizedTables(props: Props) {

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow >
                        <StyledTableCell align="left">Inicio&nbsp;trecho</StyledTableCell>
                        <StyledTableCell align="left">Fim&nbsp;trecho</StyledTableCell>
                        <StyledTableCell align="left">Duração</StyledTableCell>
                        <StyledTableCell align="left">Título</StyledTableCell>
                        <StyledTableCell align="left">Autor/Referência</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.regions.map((row) => (
                        <StyledTableRow
                            key={row.start}
                            hover
                            onClick={(event) => {
                                props.setTimeToRegion(row.start);
                            }}
                            onDoubleClick={(event) => {
                                props.playRegion(row.start);
                            }}
                        >

                            <StyledTableCell align="left" component="th" scope="row">
                                {formatTime(row.start)}
                            </StyledTableCell>
                            <StyledTableCell align="left">{formatTime(row.end)}</StyledTableCell>
                            <StyledTableCell align="left">{formatTime(row.duration)}</StyledTableCell>
                            <StyledTableCell align="left">{row.title}</StyledTableCell>
                            <StyledTableCell align="left">{row.author}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
