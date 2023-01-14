import React, {useEffect, useState} from 'react';
import {Fade, FormHelperText, Grid, Modal, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {MuiTelInput} from "mui-tel-input";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "tss-react/mui";
import FormElement from "../UI/Form/FormElement/FormElement";
import FormSelect from "../UI/Form/FormSelect/FormSelect";
import FileInput from "../UI/Form/FileInput/FileInput";
import ButtonWithProgress from "../UI/Button/ButtonWithProgress/ButtonWithProgress";
import {fetchCarriersRequest} from "../../store/actions/carriersActions";
import {
  addDriverRequest,
  clearDriverErrors,
  updateDriverRequest
} from "../../store/actions/driversActions";
import AddButton from "../UI/Button/AddButton/AddButton";
import EditButton from "../UI/Button/EditButton/EditButton";

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

const DriversModal = ({modalTitle, isAdd, driverEmail}) => {
  const {classes} = useStyles();

  const dispatch = useDispatch();

  const drivers = useSelector(state => state.drivers.drivers);
  const loading = useSelector(state => state.drivers.addDriverLoading);
  const newError = useSelector(state => state.drivers.addDriverError);
  const editError = useSelector(state => state.drivers.editDriverError);
  const carriers = useSelector(state => state.carriers.carriers);
  const user = useSelector(state => state.users.user);


  const [newModal, setNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [driverId, setDriverId] = useState('');

  const [newData, setNewData] = useState({
    email: '',
    name: '',
    phoneNumber: '',
    companyId: '',
    description: {
      address: '',
      DOB: '',
      info: '',
      reference: '',
    },
    license: '',
  });

  const [editedData, setEditedData] = useState({
    email: '',
    name: '',
    phoneNumber: '',
    companyId: '',
    description: {
      address: '',
      DOB: '',
      info: '',
      reference: '',
    },
    license: '',
  });

  useEffect(() => {
    if (user.role !== 'carrier') {
      dispatch(fetchCarriersRequest());
    }
  }, [dispatch, user.role]);

  useEffect(() => {
    if (newError === null) {
      setNewModal(false);
    }
    if (editError === null) {
      setEditModal(false);
    }
    // eslint-disable-next-line
  }, [drivers]);



  const openCloseModal = driverEmail => {
    if (isAdd) {
      setNewData({
        email: '',
        name: '',
        phoneNumber: '',
        companyId: '',
        description: {
          address: '',
          DOB: '',
          info: '',
          reference: '',
        },
        license: ''
      });

      setNewModal(true);
      dispatch(clearDriverErrors());
    } else if (!isAdd) {
      const driver = drivers.filter(item => item.email === driverEmail)[0];
      setDriverId(driver._id);

      setEditedData({
        email: driver.email,
        name: driver.name,
        phoneNumber: driver.phoneNumber,
        companyId: driver.companyId._id,
        description: {
          address: driver.description.address,
          DOB: driver.description.DOB,
          info: driver.description.info,
          reference: driver.description.reference,
        },
        license: driver.license
      });

      setEditModal(true);
      dispatch(clearDriverErrors());
    }
  };

  const inputChangeHandler = (e) => {
    if (e.target) {
      const {name, value} = e.target;
      isAdd
        ? setNewData(prev => ({...prev, [name]: value}))
        : setEditedData(prev => ({...prev, [name]: value}));
    } else {
      isAdd
        ? setNewData(prev => ({...prev, phoneNumber: e.replace(/ /g, '')}))
        : setEditedData(prev => ({...prev, phoneNumber: e.replace(/ /g, '')}));
    }
  };

  const inputChangeHandlerDescription = e => {
    const {name, value} = e.target;
    isAdd
      ? setNewData(prev => ({
        ...prev,
        description: {
          ...newData.description,
          [name]: value,
        }
      }))
      : setEditedData(prev => ({
        ...prev,
        description: {
          ...editedData.description,
          [name]: value,
        }
      }));
  };

  const fileChangeHandler = e => {
    const name = e.target.name;
    const file = e.target.files[0];

    isAdd
      ? setNewData(prev => ({...prev, [name]: file}))
      : setEditedData(prev => ({...prev, [name]: file}));
  };

  const submitFormHandler = async e => {
    e.preventDefault();

    const formData = new FormData();

    if(user.role === 'carrier'){
      newData.companyId = user.companyId?._id;
    }

    Object.keys(isAdd ? newData : editedData).forEach(key => {
      if (key === 'description') {
        formData.append(key, JSON.stringify(isAdd ? newData[key] : editedData[key]));
      } else {
        formData.append(key, isAdd ? newData[key] : editedData[key]);
      }
    });

    if (isAdd) {
      dispatch(addDriverRequest({data: formData, user}));
    } else {
      dispatch(updateDriverRequest({id: driverId, data: formData, user}));
    }
  };

  const getFieldError = fieldName => {
    try {
      return isAdd ? newError.errors[fieldName].message : editError.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };


  return (
    <>
      {isAdd
        ? <AddButton click={openCloseModal}/>
        : <EditButton
          click={() => openCloseModal(driverEmail)}
        />
      }
      <Modal
        open={isAdd ? newModal : editModal}
        onClose={() => isAdd ? setNewModal(false) : setEditModal(false)}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Fade in={isAdd ? newModal : editModal}>
          <Box sx={style}>
            <div>
              <Grid>
                <Typography variant={'h6'}>
                  {modalTitle}
                </Typography>

                <Grid
                  component='form'
                  container
                  spacing={2}
                  onSubmit={submitFormHandler}
                  pr={'15px'}
                >
                  <Grid
                    item
                    container
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <Grid item width="49.5%">
                      <FormElement
                        type={'email'}
                        name={'email'}
                        label={'Email'}
                        value={isAdd ? newData.email : editedData.email}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('email')}
                      />
                    </Grid>

                    <Grid item width="49.5%">
                      <FormElement
                        name={'name'}
                        label={'Name'}
                        value={isAdd ? newData.name : editedData.name}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('name')}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <MuiTelInput
                      error={Boolean(getFieldError('phoneNumber'))}
                      preferredCountries={['US']}
                      defaultCountry={'US'}
                      name={'phoneNumber'}
                      label={'Phone Number'}
                      value={isAdd ? newData.phoneNumber : editedData.phoneNumber}
                      required={true}
                      onChange={inputChangeHandler}
                    />
                    <FormHelperText sx={{
                      color: '#d32f2f',
                      margin: '3px 14px 0'
                    }}>{getFieldError('phoneNumber')}</FormHelperText>
                  </Grid>

                    <Grid item xs={12}>
                      {user.role === 'carrier'
                        ? <TextField
                          name={"carrier"}
                          label={"Carriers"}
                          value={user.companyId?.title}
                          className={classes.field}
                          disabled
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        : <FormSelect
                          label={'Carriers'}
                          name={'companyId'}
                          array={carriers}
                          value={isAdd ? newData.companyId : editedData.companyId}
                          onChange={inputChangeHandler}
                          required={true}
                          variant={'object'}
                          error={getFieldError('companyId')}
                        />
                      }
                  </Grid>

                  <Grid item xs={12}>
                    <FileInput
                      label='License'
                      name='license'
                      value={isAdd ? newData.license.value : editedData.license}
                      onChange={fileChangeHandler}
                      accept={'.png, .jpg, .jpeg, .pdf'}
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
                      <Grid
                        item
                        container
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Grid item width="49.5%">
                          <FormElement
                            name={'address'}
                            label={'Address'}
                            value={isAdd ? newData.description.address : editedData.description.address}
                            required={true}
                            onChange={inputChangeHandlerDescription}
                            error={getFieldError('description.address')}
                          />
                        </Grid>
                        <Grid item width="49.5%">
                          <FormElement
                            name={'DOB'}
                            label={'DOB'}
                            value={isAdd ? newData.description.DOB : editedData.description.DOB}
                            required={true}
                            onChange={inputChangeHandlerDescription}
                            error={getFieldError('description.DOB')}
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        container
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Grid item width="49.5%">
                          <FormElement
                            name={'info'}
                            label={'Info'}
                            value={isAdd ? newData.description.info : editedData.description.info}
                            required={true}
                            onChange={inputChangeHandlerDescription}
                            error={getFieldError('description.info')}
                          />
                        </Grid>
                        <Grid item width="49.5%">
                          <FormElement
                            name={'reference'}
                            label={'Reference'}
                            value={isAdd ? newData.description.reference : editedData.description.reference}
                            required={true}
                            onChange={inputChangeHandlerDescription}
                            error={getFieldError('description.reference')}
                          />
                        </Grid>
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
                      onClick={() => isAdd ? setNewModal(false) : setEditModal(false)}
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
    </>
  );
};

export default DriversModal;