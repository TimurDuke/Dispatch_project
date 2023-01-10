import React from 'react';
import {Grid} from "@mui/material";
import {MuiTelInput} from "mui-tel-input";
import PropTypes from "prop-types";

const PhoneForm = ({type, required, disabled, label, name, value, onChange, error, className}) => {
  return (
    <Grid item xs={12}>
      <MuiTelInput
        type={type}
        required={required}
        disabled={disabled}
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        error={Boolean(error)}
        helperText={error}
        autoComplete={name}
        className={className}
      />
    </Grid>
  );
};

PhoneForm.propTypes = {
  type: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PhoneForm;