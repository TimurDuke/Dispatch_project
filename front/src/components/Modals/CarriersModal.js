import React, {useEffect, useState} from 'react';
import {Box, Fade, FormHelperText, Grid, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import {MuiTelInput} from 'mui-tel-input';
import FormElement from "../UI/Form/FormElement/FormElement";
import ButtonWithProgress from "../UI/Button/ButtonWithProgress/ButtonWithProgress";
import EditButton from "../UI/Button/EditButton/EditButton";
import {
  clearCarriersErrors,
  createCarrierRequest,
  editCarrierRequest,
} from "../../store/actions/carriersActions";
import AddButton from "../UI/Button/AddButton/AddButton";
import FileInput from "../UI/Form/FileInput/FileInput";

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

const CarriersModal = ({modalTitle, isAdd, carrierID}) => {
  const dispatch = useDispatch();
  const carriers = useSelector(state => state.carriers.carriers);
  const editError = useSelector(state => state.carriers.editCarrierError);
  const newError = useSelector(state => state.carriers.addCarrierError);
  const loading = useSelector(state => state.carriers.loading);

  const [newModal, setNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [carrierId, setCarrierId] = useState('');

  const [newData, setNewData] = useState({
    title: '',
    mc: '',
    dot: '',
    fedid: '',
    description: '',
    phoneNumber: '',
    document: ''
  });

  const [editedData, setEditedData] = useState({
    title: '',
    mc: '',
    dot: '',
    fedid: '',
    description: '',
    phoneNumber: '',
    document: ''
  });


  useEffect(() => {
    if (newError === null) {
      setNewModal(false);
    }
    if (editError === null) {
      setEditModal(false);
    }
    // eslint-disable-next-line
  }, [carriers]);

  const openCloseModal = carrierID => {
    if (isAdd) {
      setNewData({
        title: '',
        mc: '',
        dot: '',
        fedid: '',
        description: '',
        phoneNumber: '',
        document: ''
      });

      setNewModal(true);
      dispatch(clearCarriersErrors());
    } else if (!isAdd) {
      const carrier = carriers.filter(item => item._id === carrierID)[0];
      setCarrierId(carrier._id);

      setEditedData({
        title: carrier.title,
        mc: carrier.mc,
        dot: carrier.dot,
        fedid: carrier.fedid,
        description: carrier.description,
        phoneNumber: carrier.phoneNumber,
        document: carrier.document
      });

      setEditModal(true);
      dispatch(clearCarriersErrors());
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
    Object.keys(isAdd ? newData : editedData).forEach(key => {
      formData.append(key, isAdd ? newData[key] : editedData[key]);
    });

    if (isAdd) {
      dispatch(createCarrierRequest(formData));
    } else {
      dispatch(editCarrierRequest({id: carrierId, data: formData}));
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
          click={() => openCloseModal(carrierID)}
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
                    <Grid item width='100%'>
                      <FormElement
                        type={'title'}
                        name={'title'}
                        label={'Company name'}
                        value={isAdd ? newData.title : editedData.title}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('title')}
                      />
                    </Grid>

                    <Grid item xs={12} width='100%'>
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

                    <Grid item width='50%'>
                      <FormElement
                        name={'mc'}
                        label={'MC'}
                        value={isAdd ? newData.mc : editedData.mc}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('mc')}
                      />
                    </Grid>

                    <Grid item width='50%'>
                      <FormElement
                        name={'dot'}
                        label={'DOT'}
                        value={isAdd ? newData.dot : editedData.dot}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('dot')}
                      />
                    </Grid>

                    <Grid item width='100%'>
                      <FormElement
                        name={'fedid'}
                        label={'FED ID'}
                        value={isAdd ? newData.fedid : editedData.fedid}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('fedid')}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FileInput
                        label={'Document'}
                        name={'document'}
                        value={isAdd ? newData.document.value : editedData.document}
                        onChange={fileChangeHandler}
                        accept={'.png, .jpg, .jpeg, .pdf'}
                      />
                    </Grid>

                    <Grid item width='100%'>
                      <FormElement
                        name={'description'}
                        label={'Description'}
                        value={isAdd ? newData.description : editedData.description}
                        onChange={inputChangeHandler}
                        error={getFieldError('description')}
                      />
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

export default CarriersModal;