import React from 'react';
import {IconButton, TableCell, TableRow} from "@mui/material";
import EditDriver from "../../Modals/EditDriver";
import {apiUrl} from "../../../config";
import {Description} from "@mui/icons-material";

const DriverTableBody = ({columns, filteredData}) => {
    return (
        <>
            {filteredData.map(driver => (
                <TableRow
                    key={driver._id}
                    sx={{
                        '&:last-child td, &:last-child th': {border: 0}, background: "white"
                    }}
                >
                    {columns.map(column => {
                        let value = driver[column.key];
                        if (column.innerKey) {
                            value = value[column.innerKey];
                        }
                        if (column.key === 'license' && driver.license) {
                            value =
                                <a href={apiUrl + '/' + driver.license} target="_blank" rel="noreferrer">
                                    <IconButton color="primary">
                                        <Description/>
                                    </IconButton>
                                </a>
                        }
                        if(column.key === 'description') {
                            return <TableCell
                                sx={{
                                    fontSize: "12px",
                                    cursor: 'default',
                                    maxWidth: '150px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                }} key={column.key + column.innerKey}>{value}
                            </TableCell>;
                        }
                        if(column.key === 'companyId') {
                            return <TableCell
                                sx={{
                                    fontSize: '12px',
                                    minWidth: '150px',
                                }} key={column.key + column.innerKey}>{value}
                            </TableCell>;
                        }
                        return <TableCell
                            sx={{
                                fontSize: "12px",
                            }} key={column.key + column.innerKey}>{value}</TableCell>;
                    })}
                    <EditDriver driverEmail={driver.email}/>
                </TableRow>
            ))}
        </>
    );
};

export default DriverTableBody;