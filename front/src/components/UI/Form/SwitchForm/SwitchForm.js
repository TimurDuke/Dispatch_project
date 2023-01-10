import React from 'react';
import {Box, FormControlLabel, Switch} from "@mui/material";
import PropTypes from "prop-types";

const SwitchForm = ({checked, handleChange, id, name, label, width}) => {
  return (
    <Box width={width}>
      <FormControlLabel
        control={
          <Switch checked={checked} onChange={handleChange} id={id} name={name} />
        }
        label={label}
      />
    </Box>
  );
};

SwitchForm.propTypes = {
  checked: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired
};

export default SwitchForm;