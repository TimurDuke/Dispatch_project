import React from 'react';
import add from '../../../../assets/addButton.svg';
import {makeStyles} from "tss-react/mui";
import {Grid} from "@mui/material";

const useStyles = makeStyles()(() => ({
  add: {
    marginTop: "19px",
    marginLeft: "7px",
    marginBottom: "19px"
  }
}));

const AddButton = ({click}) => {
  const {classes} = useStyles();

  return (
    <Grid item onClick={click} sx={{paddingLeft: "15px", cursor: "pointer"}}>
      <img src={add} className={classes.add} alt="add"/>
    </Grid>

  );
};

export default AddButton;