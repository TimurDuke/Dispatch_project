import React, {useEffect, useState} from 'react';
import {Box, FormHelperText, Grid, Modal, TableCell} from "@mui/material";
import Typography from "@mui/material/Typography";
import {makeStyles} from "tss-react/mui";
import {useDispatch, useSelector} from "react-redux";
import FormElement from "../UI/Form/FormElement/FormElement";
import ButtonWithProgress from "../UI/Button/ButtonWithProgress/ButtonWithProgress";
import EditButton from "../UI/Button/EditButton/EditButton";
import {clearCarriersErrors, editCarrierRequest} from "../../store/actions/carriersActions";
import {MuiTelInput} from 'mui-tel-input';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  padding: '20px'
};

const useStyles = makeStyles()(() => ({
  field: {
    background: "white"
  }
}));

const EditCarrier = ({carrier}) => {
  const {classes} = useStyles();

  const dispatch = useDispatch();
  const carriers = useSelector(state => state.carriers.carriers);
  const error = useSelector(state => state.carriers.editCarrierError);
  const loading = useSelector(state => state.carriers.loading);

  const [modal, setModal] = useState(false);

  const [carrierData, setCarrierData] = useState({
    title: '',
    mc: '',
    dot: '',
    fedid: '',
    description: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (error === null) {
      setModal(false);
    }
    // eslint-disable-next-line
  }, [carriers]);

  const openModalHandler = () => {
    setCarrierData(carrier);
    dispatch(clearCarriersErrors());
    setModal(true);
  };

  const inputChangeHandler = e => {
    if (e.target) {
      const {name, value} = e.target;
      setCarrierData(prev => ({...prev, [name]: value}));
    } else {
      setCarrierData(prev => ({...prev, phoneNumber: e.replace(/ /g, '')}))
    }
  };

  const submitFormHandler = async e => {
    e.preventDefault();
    await dispatch(editCarrierRequest({id: carrier._id, data: {...carrierData}}));
  };

  const getFieldError = fieldName => {
    try {
      return error.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <TableCell>
      <EditButton
        click={() => openModalHandler()}
      />
      <Modal
        keepMounted
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          {carrier ?
            <>
              <Typography id="keep-mounted-modal-description" sx={{mb: 2}}>
                Edit Carrier
              </Typography>
                <Grid
                  container
                  textAlign="center"
                  spacing={2}
                  component="form"
                  onSubmit={submitFormHandler}
                >
                  <FormElement
                    onChange={inputChangeHandler}
                    name="title"
                    label="Company name"
                    value={carrierData.title}
                    required={true}
                    error={getFieldError('title')}
                    className={classes.field}
                  />
  
                  <Grid item xs={12}>
                    <MuiTelInput
                      error={Boolean(getFieldError('phoneNumber'))}
                      preferredCountries={['US']}
                      defaultCountry={'US'}
                      name={'phoneNumber'}
                      label={'Phone Number'}
                      value={carrierData.phoneNumber}
                      required={true}
                      onChange={inputChangeHandler}
                    />
                    <FormHelperText sx={{
                      color: '#d32f2f',
                      margin: '3px 14px 0'
                    }}>{getFieldError('phoneNumber')}</FormHelperText>
                  </Grid>

                  <FormElement
                    onChange={inputChangeHandler}
                    name="mc"
                    label="MC"
                    value={carrierData.mc}
                    required={true}
                    error={getFieldError('mc')}
                    className={classes.field}
                  />

                  <FormElement
                    onChange={inputChangeHandler}
                    name="dot"
                    label="DOT"
                    value={carrierData.dot}
                    required={true}
                    error={getFieldError('dot')}
                    className={classes.field}
                  />

                  <FormElement
                    onChange={inputChangeHandler}
                    name="fedid"
                    label="FED-ID"
                    value={carrierData.fedid}
                    required={true}
                    error={getFieldError('fedid')}
                    className={classes.field}
                  />

                  <FormElement
                    onChange={inputChangeHandler}
                    name="description"
                    label="Description"
                    value={carrierData.description}
                    multiline={true}
                    rows={3}
                    error={getFieldError('description')}
                    className={classes.field}
                  />

                  <Grid item xs={6}>
                    <ButtonWithProgress
                      loading={loading}
                      disabled={loading}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={submitFormHandler}
                    >
                      Save
                    </ButtonWithProgress>
                  </Grid>

                  <Grid item xs={6}>
                    <ButtonWithProgress
                      type="button"
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => setModal(false)}
                    >
                      Cancel
                    </ButtonWithProgress>
                  </Grid>

                </Grid>
            </>
            : <h4>Please choose a carrier to edit!</h4>}
        </Box>
      </Modal>
    </TableCell>
  );
};

export default EditCarrier;