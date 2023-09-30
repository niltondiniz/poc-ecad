import * as React from 'react';


import { RegionInfo } from '../interfaces/region-info.interface';
import { formatTime } from '../utils/helpers';
import { Box, Button } from '@mui/material';
import { DataGrid, GridRowParams } from '@mui/x-data-grid';

interface Props {
    regions: RegionInfo[];
    playRegion: any;
    setTimeToRegion: any;
    selectedRow: any;
}

export default function CustomizedTables(props: Props) {

    const columns = [
        { field: "id", headerName: "ID", minWidth: 50, flex: 0.5 },
        { field: "start", headerName: "Início trecho", valueGetter: (params) => formatTime(params.row.start), minWidth: 50, flex: 0.5 },
        { field: "end", headerName: "Fim trecho", valueGetter: (params) => formatTime(params.row.end), minWidth: 50, flex: 0.5 },
        { field: "duration", headerName: "Duração", valueGetter: (params) => formatTime(params.row.duration), minWidth: 50, flex: 0.5 },
        { field: "title", headerName: "Título", minWidth: 50, flex: 2 },
        { field: "author", headerName: "Autor/Referência", minWidth: 50, flex: 2 }       
    ];

    return (

        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                onCellClick={(params, event) => {
                    props.setTimeToRegion(params.row.start);
                }}
                onCellDoubleClick={(params, event) => {
                    props.playRegion(params.row.start);
                }}
                rows={props.regions}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                rowSelectionModel={props.selectedRow}
            />
        </Box>

        // <TableContainer component={Paper}>
        //     <Table sx={{ minWidth: 700 }} aria-label="customized table">
        //         <TableHead>
        //             <TableRow >
        //                 <StyledTableCell align="left">Inicio&nbsp;trecho</StyledTableCell>
        //                 <StyledTableCell align="left">Fim&nbsp;trecho</StyledTableCell>
        //                 <StyledTableCell align="left">Duração</StyledTableCell>
        //                 <StyledTableCell align="left">Título</StyledTableCell>
        //                 <StyledTableCell align="left">Autor/Referência</StyledTableCell>
        //             </TableRow>
        //         </TableHead>
        //         <TableBody>
        //             {props.regions.map((row) => (
        //                 <StyledTableRow
        //                     key={row.start}
        //                     hover
        //                     onClick={(event) => {
        //                         props.setTimeToRegion(row.start);
        //                     }}
        //                     onDoubleClick={(event) => {
        //                         props.playRegion(row.start);
        //                     }}
        //                 >

        //                     <StyledTableCell align="left" component="th" scope="row">
        //                         {formatTime(row.start)}
        //                     </StyledTableCell>
        //                     <StyledTableCell align="left">{formatTime(row.end)}</StyledTableCell>
        //                     <StyledTableCell align="left">{formatTime(row.duration)}</StyledTableCell>
        //                     <StyledTableCell align="left">{row.title}</StyledTableCell>
        //                     <StyledTableCell align="left">{row.author}</StyledTableCell>
        //                 </StyledTableRow>
        //             ))}
        //         </TableBody>
        //     </Table>
        // </TableContainer>
    );
}
