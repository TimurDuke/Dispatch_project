import React, {useEffect, useState} from 'react';
import {Fade, FormHelperText, Grid, Modal, Typography} from '@mui/material';
import {makeStyles} from 'tss-react/mui';
import {MuiTelInput} from 'mui-tel-input';
import Box from "@mui/material/Box";
import FormElement from '../UI/Form/FormElement/FormElement';
import FormSelect from '../UI/Form/FormSelect/FormSelect';
import {DRIVER_STATUS} from '../../constants';
import {useDispatch, useSelector} from 'react-redux';
import {addDriverRequest, changeModalBoolean, clearDriverErrors} from '../../store/actions/driversActions';
import {fetchCarriersRequest} from '../../store/actions/carriersActions';
import FileInput from '../UI/Form/FileInput/FileInput';
import ButtonWithProgress from "../UI/Button/ButtonWithProgress/ButtonWithProgress";
import AddButton from "../UI/Button/AddButton/AddButton";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  backgroundColor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const useStyles = makeStyles()(() => ({
  descriptionFieldset: {
    borderRadius: '4px',
    border: '1px solid #757575'
  },
  descriptionLegend: {
    padding: '0 10px'
  },
}));

const AddDriver = () => {
  const {classes} = useStyles();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.drivers.addDriverLoading);
  const carriers = useSelector(state => state.carriers.carriers);
  const error = useSelector(state => state.drivers.addDriverError);
  const modal = useSelector(state => state.drivers.modal);
  const [state, setState] = useState({
    email: '',
    name: '',
    phoneNumber: '',
    companyId: '',
    status: '',
    description: {
      address: '',
      DOB: '',
      info: '',
      reference: '',
    },
    license: '',
  });

  useEffect(() => {
    dispatch(fetchCarriersRequest());
  }, [dispatch]);

  const openCloseModal = () => {
    dispatch(changeModalBoolean());
    setState({
      email: '',
      name: '',
      phoneNumber: '',
      companyId: '',
      status: '',
      description: {
        address: '',
        DOB: '',
        info: '',
        reference: '',
      },
    });
    dispatch(clearDriverErrors());
  };

  const inputChangeHandler = (e) => {
    if (e.target) {
      const {name, value} = e.target;
      setState(prev => ({...prev, [name]: value}));
    } else {
      setState(prev => ({...prev, phoneNumber: e.replace(/ /g, '')}));
    }
  };

  const inputChangeHandlerDescription = e => {
    const {name, value} = e.target;
    setState(prev => ({
      ...prev,
      description: {
        ...state.description,
        [name]: value,
      }
    }));
  };

  const fileChangeHandler = e => {
    const name = e.target.name;
    const file = e.target.files[0];

    setState(prev => ({...prev, [name]: file}));
  };

  const submitFormHandler = e => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(state).forEach(key => {
      if (key === 'description') {
        formData.append(key, JSON.stringify(state[key]));
      } else {
        formData.append(key, state[key]);
      }
    });

    dispatch(addDriverRequest(formData));
  };

  const getFieldError = fieldName => {
    try {
      return error.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <div>
      <AddButton click={openCloseModal}/>
      <Modal
        open={modal}
        onClose={() => dispatch(changeModalBoolean())}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Fade in={modal}>
          <Box sx={style}>
            <div>
              <Grid>
                <Typography variant={'h6'}>
                  Add Driver
                </Typography>

                <Grid
                  component='form'
                  container
                  spacing={2}
                  onSubmit={submitFormHandler}
                  pr={'15px'}
                >
                    <Grid item xs={12} display={'flex'}>
                      <FormElement
                        type={'email'}
                        name={'email'}
                        label={'Email'}
                        value={state.email}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('email')}
                      />

                      <FormElement
                        name={'name'}
                        label={'Name'}
                        value={state.name}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('name')}
                      />
                    </Grid>

                  <Grid item xs={12}>
                    <MuiTelInput
                      error={Boolean(getFieldError('phoneNumber'))}
                      preferredCountries={['US']}
                      defaultCountry={'US'}
                      name={'phoneNumber'}
                      label={'Phone Number'}
                      value={state.phoneNumber}
                      required={true}
                      onChange={inputChangeHandler}
                    />
                    <FormHelperText sx={{
                      color: '#d32f2f',
                      margin: '3px 14px 0'
                    }}>{getFieldError('phoneNumber')}</FormHelperText>
                  </Grid>

                  <Grid item xs={12} display={'flex'}>
                    <FormSelect
                      label={'Carriers'}
                      name={'companyId'}
                      array={carriers}
                      value={state.companyId}
                      onChange={inputChangeHandler}
                      required={true}
                      variant={'object'}
                      error={getFieldError('companyId')}
                    />

                    <FormSelect
                      label={'Status'}
                      name={'status'}
                      array={DRIVER_STATUS}
                      value={state.status}
                      onChange={inputChangeHandler}
                      required={true}
                      variant={'array'}
                      error={getFieldError('status')}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FileInput
                      label='License'
                      name='license'
                      onChange={fileChangeHandler}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Grid
                      component='fieldset'
                      m={0} width={'100%'}
                      container
                      className={classes.descriptionFieldset}
                      spacing={2}
                    >
                      <legend className={classes.descriptionLegend}>Description</legend>
                      <Grid item xs={12} display={'flex'}>
                        <FormElement
                          name={'address'}
                          label={'Address'}
                          value={state.description.address}
                          required={true}
                          onChange={inputChangeHandlerDescription}
                          error={getFieldError('description.address')}
                        />

                        <FormElement
                          name={'DOB'}
                          label={'DOB'}
                          value={state.description.DOB}
                          required={true}
                          onChange={inputChangeHandlerDescription}
                          error={getFieldError('description.DOB')}
                        />
                      </Grid>

                      <Grid item xs={12} display={'flex'}>
                        <FormElement
                          name={'info'}
                          label={'Info'}
                          value={state.description.info}
                          required={true}
                          onChange={inputChangeHandlerDescription}
                          error={getFieldError('description.info')}
                        />

                        <FormElement
                          name={'reference'}
                          label={'Reference'}
                          value={state.description.reference}
                          required={true}
                          onChange={inputChangeHandlerDescription}
                          error={getFieldError('description.reference')}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={6}>
                    <ButtonWithProgress
                      loading={loading}
                      disabled={loading}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
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
                      onClick={openCloseModal}
                    >
                      Cancel
                    </ButtonWithProgress>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default AddDriver;