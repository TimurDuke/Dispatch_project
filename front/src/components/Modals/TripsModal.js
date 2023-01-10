import React, {useEffect, useState} from 'react';
import {makeStyles} from "tss-react/mui";
import {useDispatch, useSelector} from "react-redux";
import {Alert, Box, Fade, Grid, Modal, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import FormElement from "../UI/Form/FormElement/FormElement";
import FormSelect from "../UI/Form/FormSelect/FormSelect";
import ButtonWithProgress from "../UI/Button/ButtonWithProgress/ButtonWithProgress";
import {fetchDriversRequest} from "../../store/actions/driversActions";
import {clearCreateTripErrorRequest, createTripRequest, editTripRequest} from "../../store/actions/tripsActions";
import FileInput from "../UI/Form/FileInput/FileInput";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {apiUrl} from "../../config";
import {fetchUsersRequest} from "../../store/actions/usersActions";
import AddButton from "../UI/Button/AddButton/AddButton";
import {fetchBrokersRequest} from "../../store/actions/brokersActions";
import TripsComments from '../TripsComments/TripsComments';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxHeight: 600,
  overflow: "auto",
  bgcolor: 'background.paper',
  boxShadow: 24,
  padding: '20px'
};

const useStyles = makeStyles()(theme => ({
  field: {
    background: "white",
    fontSize: "12px"
  },
  link: {
    color: "white",
    textDecoration: "none",
  }
}));


const TripsModal = ({modalTitle, isAdd, tripID, isEdit}) => {
  const {classes} = useStyles();
  const dispatch = useDispatch();
  const trips = useSelector(state => state.trips.trips);
  const newError = useSelector(state => state.trips.createTripError);
  const editError = useSelector(state => state.trips.editTripError);
  const loading = useSelector(state => state.trips.loading);
  const drivers = useSelector(state => state.drivers.drivers);
  const user = useSelector(state => state.users.user);
  const trip = useSelector(state => state.trips.trip);
  const brokers = useSelector(state => state.brokers.brokers);

  const [newModal, setNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  
  const [tripId, setTripId] = useState('');

  useEffect(() => setEditModal(isEdit), [isEdit])

  const [newData, setNewData] = useState({
    loadCode: "",
    driverId: "",
    dispatchId: user._id,
    price: "",
    miles: "",
    rpm: "",
    datePU: "",
    dateDEL: "",
    timeToPU: "",
    timeToDel: "",
    pu: "",
    del: "",
    status: "",
    comment: "",
    RC: "",
    BOL: "",
    brokerId: "",
  });
  const [editedData, setEditedData] = useState({
    loadCode: "",
    driverId: "",
    dispatchId: user._id,
    price: "",
    miles: "",
    rpm: "",
    datePU: "",
    dateDEL: "",
    timeToPU: "",
    timeToDel: "",
    pu: "",
    del: "",
    status: "",
    comment: "",
    RC: "",
    BOL: "",
    brokerId: "",
  });
  
  const [commentArray, setCommentArray] = useState([]);

  useEffect(() => {
    dispatch(fetchUsersRequest());
    dispatch(fetchDriversRequest());
    dispatch(fetchBrokersRequest());
  }, [dispatch]);

  useEffect(() => {
    if (newError === null) {
      setNewModal(false);
    }
    if (editError === null) {
      setEditModal(false);
    }
    // eslint-disable-next-line
  }, [trips]);

  const openCloseModal = () => {
    if (isAdd) {
      setNewData({
        loadCode: "",
        driverId: "",
        dispatchId: user._id,
        price: "",
        miles: "",
        rpm: "",
        datePU: "",
        dateDEL: "",
        timeToPU: "",
        timeToDel: "",
        pu: "",
        del: "",
        status: "",
        comment: "",
        RC: "",
        BOL: "",
        brokerId: "",
      });
      setStartDate(null);
      setFinDate(null);
      setNewModal(true);
      dispatch(clearCreateTripErrorRequest());
    }
  };

  useEffect(() =>{
  if (isEdit && tripID) {
    setTripId(trip._id);
    setStartDate(trip.datePU);
    setFinDate(trip.dateDEL);
    setEditedData({
      loadCode: trip.loadCode,
      driverId: trip.driverId ? trip.driverId._id : '',
      dispatchId: trip.dispatchId._id,
      price: +trip.price,
      miles: +trip.miles,
      rpm: +trip.rpm,
      pu: trip.pu,
      del: trip.del,
      status: trip.status,
      comment: '',
      timeToPU: trip.timeToPU,
      timeToDel: trip.timeToDel,
      RC: trip.RC || '',
      BOL: trip.BOL || '',
      brokerId: trip.brokerId ? trip.brokerId._id : '',
    });
    
    setCommentArray(trip.comment);
    setEditModal(true);
    dispatch(clearCreateTripErrorRequest());
  }}, [dispatch, isEdit, tripID, trips, trip]);

  const [startDate, setStartDate] = useState(null);
  const [finDate, setFinDate] = useState(null);

  const inputChangeHandler = (e) => {
    if (e.target) {
      const {name, value} = e.target;
      isAdd
        ? setNewData(prev => ({...prev, [name]: value}))
        : setEditedData(prev => ({...prev, [name]: value}));
    }
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

    let currentTrip;
    if(isAdd) {
      currentTrip = newData;
      currentTrip.datePU = startDate;
      currentTrip.dateDEL = finDate;
    } else if(isEdit) {
      currentTrip = editedData;
      currentTrip.datePU = startDate;
      currentTrip.dateDEL = finDate;
    }

    Object.keys(currentTrip).forEach(key => {
      if (key === 'description') {
        formData.append(key, JSON.stringify(isAdd ? newData[key] : editedData[key]));
      } else {
        formData.append(key, isAdd ? newData[key] : editedData[key]);
      }
    });

    if (isAdd) {
      dispatch(createTripRequest(formData));
    } else {

      dispatch(editTripRequest({tripData: formData, id: tripId, path: editedData.status}));
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
        : null
      }
      <Modal
        open={isAdd ? newModal : editModal}
        onClose={() => isAdd ? setNewModal(false) : setEditModal(false)}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Fade in={isAdd ? newModal : editModal}>
          <Box sx={style}>
            <Typography variant={'h6'}>
              {modalTitle}
            </Typography>
            
            <Grid
              container
              direction="column"
            >
              <Grid item mb={2}>
                {(editError && Object.keys(editError).length === 1) && (
                  <Alert severity="error">
                    Error! {editError.message}
                  </Alert>
                )}
              </Grid>

              <Grid item mb={2}>
                {(newError && Object.keys(newError).length === 1) && (
                  <Alert severity="error">
                    Error! {newError.message}
                  </Alert>
                )}
              </Grid>

                <Grid
                  component="form"
                  container
                  onSubmit={submitFormHandler}
                  textAlign="center"
                  spacing={1}
                >
                  <Grid
                    item
                    container
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <Grid item width="49.5%">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          label="Loading date"
                          inputFormat="MM/DD/YYYY"
                          onChange={(date) => setStartDate(date)}
                          error={getFieldError('datePU')}
                          value={startDate}
                          renderInput={(params) => <TextField name="datePU" {...params} required={true}/>}/>
                      </LocalizationProvider>

                    </Grid>

                  <Grid item width="49.5%">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Arrival date"
                        inputFormat="MM/DD/YYYY"
                        onChange={(date) => setFinDate(date)}
                        value={finDate}
                        renderInput={(params) => <TextField name="dateDEL" {...params} required={true}/>}/>
                    </LocalizationProvider>
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
                      type={'timeToPU'}
                      name={'timeToPU'}
                      label={'Time to PU'}
                      value={isAdd ? newData.timeToPU : editedData.timeToPU}
                      required={true}
                      onChange={inputChangeHandler}
                      error={getFieldError('timeToPU')}
                    />
                  </Grid>

                  <Grid item width="49.5%">
                    <FormElement
                      type={'timeToDel'}
                      name={'timeToDel'}
                      label={'Time to DEL'}
                      value={isAdd ? newData.timeToDel : editedData.timeToDel}
                      required={true}
                      onChange={inputChangeHandler}
                      error={getFieldError('timeToDel')}
                    />
                  </Grid>
                </Grid>

                  <FormElement
                    type={'loadCode'}
                    name={'loadCode'}
                    label={'Load Code'}
                    value={isAdd ? newData.loadCode : editedData.loadCode}
                    required={true}
                    onChange={inputChangeHandler}
                    error={getFieldError('loadCode')}
                    className={classes.field}
                  />

                  <Grid
                    item
                    container
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <Grid item width="49.5%">
                      <FormElement
                        type={'pu'}
                        name={'pu'}
                        label={'Loading location'}
                        value={isAdd ? newData.pu : editedData.pu}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('pu')}
                        className={classes.field}
                      />
                    </Grid>

                    <Grid item width="49.5%">
                      <FormElement
                        type={'del'}
                        name={'del'}
                        label={'Unloading location'}
                        value={isAdd ? newData.del : editedData.del}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('del')}
                        className={classes.field}
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
                        type={'number'}
                        name={'miles'}
                        label={'Miles'}
                        value={isAdd ? newData.miles : editedData.miles}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('miles')}
                        className={classes.field}
                        inputProps={{min:0, step: '0.01'}}
                      />
                    </Grid>

                    <Grid item width="49.5%">
                      <FormElement
                        type={'number'}
                        name={'rpm'}
                        label={'Rate per mile'}
                        value={isAdd ? newData.rpm : editedData.rpm}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('rpm')}
                        className={classes.field}
                        inputProps={{min:0, step: '0.01'}}
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
                        type={'number'}
                        name={'price'}
                        label={'Price'}
                        value={isAdd ? newData.price : editedData.price}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('price')}
                        className={classes.field}
                        inputProps={{min:0, step: '0.01'}}
                      />
                    </Grid>
                    <Grid item width="49.5%">
                      <FormSelect
                          type={'string'}
                          name={'brokerId'}
                          label={'Broker'}
                          value={isAdd ? newData.brokerId : editedData.brokerId}
                          onChange={inputChangeHandler}
                          error={getFieldError('brokerId')}
                          driver={true}
                          array={brokers}
                          required={false}
                          variant="object"
                      />
                    </Grid>
                  </Grid>

                  <FormSelect
                    type={'string'}
                    name={'driverId'}
                    label={'Driver'}
                    value={isAdd ? newData.driverId : editedData.driverId}
                    onChange={inputChangeHandler}
                    error={getFieldError('driverId')}
                    driver={true}
                    array={drivers.filter((driver) => {return driver.status === 'ready' || driver.status === 'in transit'})}
                    required={false}
                    variant="object"
                  />

                  <Grid item>
                    <FileInput name="RC" label="RC file" onChange={fileChangeHandler} required={false}/>
                  </Grid>

                  <Grid item>
                    <FileInput name="BOL" label="BOL file" onChange={fileChangeHandler} required={false}/>
                  </Grid>

                  <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%', margin: '12px 0 12px 10px'}}>
                    {editedData && editedData.RC
                      ? <ButtonWithProgress variant="contained" component="label">
                          <a href={apiUrl + editedData.RC.slice(6)} target="_blank" download className={classes.link} rel="noreferrer">Download RC</a>
                        </ButtonWithProgress>
                      : null
                    }

                    {editedData && editedData.BOL
                      ? <ButtonWithProgress variant="contained" component="label">
                          <a href={apiUrl + editedData.BOL.slice(6)} target="_blank" download className={classes.link} rel="noreferrer">Download BOL</a>
                        </ButtonWithProgress>
                      : null
                    }
                  </Box>
                  
                  <div style={{margin: '8px 0 0 8px', width: '100%'}}>
                    <TripsComments commentArray={commentArray} user={user}/>
                  </div>

                  <FormElement
                    onChange={inputChangeHandler}
                    name="comment"
                    label="Comment"
                    value={isAdd ? newData.comment : editedData.comment}
                    multiline={true}
                    required={false}
                    rows={2}
                    error={getFieldError('comment')}
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

          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default TripsModal;