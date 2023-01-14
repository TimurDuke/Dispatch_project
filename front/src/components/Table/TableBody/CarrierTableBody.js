import React from 'react';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import EditCarrier from "../../Modals/EditCarrier";
import {IconButton} from "@mui/material";
import {Description} from "@mui/icons-material";
import {apiUrl} from "../../../config";

const CarrierTableBody = ({columns, carriers}) => {
  return (
    <>
      {carriers.map(carrier => (
        <TableRow
          key={carrier._id}
          sx={{'&:last-child td, &:last-child th': {border: 0}, background: "white"}}
        >
          {columns.map(column => {
            let value = carrier[column.key];
            if (column.innerKey) {
              value = value[column.innerKey];
            }
            if(column.key === 'document' && carrier[column.key]){
              value =
                <a href={apiUrl + '/' + carrier.document} download={carrier.title} target="_blank" rel="noreferrer">
                  <IconButton color="primary"><Description/></IconButton>
                </a>
            }
            return <TableCell sx={{fontSize: "12px"}} key={column.key + column.innerKey}>{value}</TableCell>;
          })}
          <EditCarrier carrierID={carrier._id}/>
        </TableRow>
      ))}
    </>
  );
};

export default CarrierTableBody;