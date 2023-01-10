import React from 'react';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import SwitchForm from "../../UI/Form/SwitchForm/SwitchForm";
import defaultAvatar from "../../../assets/default-avatar.png";
import {Avatar} from "@mui/material";
import {apiUrl} from "../../../config";

const DispatcherTableBody = ({dispatchers, switchHandler}) => {
  return (
    <>
      {dispatchers.map(dispatcher => (
        <TableRow
          key={dispatcher._id}
          sx={{
            '&:last-child td, &:last-child th': {border: 0}, background: "white",
            cursor: "pointer", ":active": {background: '#f0f2fe'}
          }}
        >
          <TableCell component="th" scope="row" sx={{fontSize: "18px"}}>
            <Avatar
              alt={dispatcher.displayName}
              src={dispatcher.avatar ? apiUrl + '/' + dispatcher.avatar : defaultAvatar}
              sx={{width: 32, height: 32, mr: 1, marginLeft: "15px"}}
            />
          </TableCell>
          <TableCell component="th" scope="row" sx={{fontSize: "18px"}}>
            {dispatcher.email}
          </TableCell>
          <TableCell component="th" scope="row" sx={{fontSize: "18px"}}>
            {dispatcher.displayName}
          </TableCell>
          <TableCell component="th" scope="row" sx={{fontSize: "18px"}}>
            {dispatcher.phoneNumber}
          </TableCell>
          <TableCell component="th" scope="row" sx={{fontSize: "16px"}}>
            <SwitchForm
              width={200}
              handleChange={switchHandler}
              id={dispatcher._id}
              name="isWorking"
              checked={dispatcher.isWorking === 'active'}
              label={dispatcher.isWorking === 'active' ? 'Active' : 'Disabled'}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default DispatcherTableBody;