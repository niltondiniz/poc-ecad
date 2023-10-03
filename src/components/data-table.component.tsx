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

        <Box sx={{ height: 300, width: '100%' }}>
            <DataGrid sx={{
                '& .MuiDataGrid-columnHeader': {
                    backgroundColor: "#1976d2",
                    color: "white",
                    fontSize: "1rem",
                },
            }}

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
        
    );
}
