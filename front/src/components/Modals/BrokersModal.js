import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Box, Fade, FormHelperText, Grid, IconButton, Modal, Typography} from "@mui/material";
import {MuiTelInput} from 'mui-tel-input';
import {Add, Delete} from "@mui/icons-material";
import FormElement from "../UI/Form/FormElement/FormElement";
import ButtonWithProgress from "../UI/Button/ButtonWithProgress/ButtonWithProgress";
import EditButton from "../UI/Button/EditButton/EditButton";
import AddButton from "../UI/Button/AddButton/AddButton";
import FormSelect from "../UI/Form/FormSelect/FormSelect";
import {clearBrokersErrors, createBrokerRequest, editBrokerRequest} from "../../store/actions/brokersActions";

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

const BrokersModal = ({modalTitle, isAdd, brokerID}) => {

    const dispatch = useDispatch();
    const brokers = useSelector(state => state.brokers.brokers);
    const carriers = useSelector(state => state.carriers.carriers);
    const editError = useSelector(state => state.brokers.editBrokerError);
    const newError = useSelector(state => state.brokers.addBrokerError);
    const loading = useSelector(state => state.brokers.loading);

    const [newModal, setNewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const [brokerId, setBrokerId] = useState('');

    const [newData, setNewData] = useState({
        name: '',
        mc: '',
        description: '',
    });

    const [phoneNumbers, setPhoneNumbers] = useState(['']);

    const addPhoneNumber = () => {
        setPhoneNumbers(prev => [
            ...prev,
            ''
        ]);
    };

    const deletePhoneNumber = index => {
        setPhoneNumbers([
            ...phoneNumbers.slice(0, index),
            ...phoneNumbers.slice(index + 1)
        ]);
    };

    const phoneChangeHandler = (e, index) => {
        setPhoneNumbers(prev => {
            const arr = [...prev];
            arr[index] = e.replace(/ /g, '');
            return arr;
        });
    };

    const [companiesContracts, setCompaniesContracts] = useState(['']);
    const [availableCompanies, setAvailableCompanies] = useState([]);

    const addCompaniesContract = () => {
        setCompaniesContracts(prev => [
            ...prev,
            ''
        ]);
    };

    const deleteCompaniesContract = index => {
        const target = companiesContracts[index]
        if (target._id) {
            setAvailableCompanies(prev => {
                return [...prev, target]
            })
        }

        setCompaniesContracts([
            ...companiesContracts.slice(0, index),
            ...companiesContracts.slice(index + 1)
        ]);
    };

    const companiesChangeHandler = (e, index, oldValue) => {
        let target = {};
        carriers.forEach(c => {
            if (c._id === e.target.value) {
                target = c;
            }
        })

        if (oldValue._id) {
            setAvailableCompanies(prev => {
                return [...prev, oldValue]
            })
        }

        setCompaniesContracts(prev => {
            const arr = [...prev];
            arr[index] = target;
            return arr;
        });

        setAvailableCompanies(prev => {
            const arr = [...prev];
            return arr.filter(i =>
                i._id !== target._id
            )
        });
    };

    const [editedData, setEditedData] = useState({
        name: '',
        mc: '',
        description: '',
    });

    useEffect(() => {
        setAvailableCompanies(carriers);
    }, [carriers]);

    useEffect(() => {
        if (newError === null) {
            setNewModal(false);
        }
        if (editError === null) {
            setEditModal(false);
        }
        // eslint-disable-next-line
    }, [brokers]);

    const openCloseModal = brokerID => {
        if (isAdd) {
            setNewData({
                name: '',
                mc: '',
                description: '',
            });
            setPhoneNumbers(['']);
            setCompaniesContracts(['']);

            setNewModal(true);
            dispatch(clearBrokersErrors());
        } else if (!isAdd) {
            const broker = brokers.filter(item => item._id === brokerID)[0];
            setBrokerId(broker._id);

            setEditedData({
                name: broker.name,
                mc: broker.mc,
                description: broker.description,
            });
            setPhoneNumbers(broker.phoneNumber);
            setCompaniesContracts(broker.companiesContract);
            setAvailableCompanies(carriers.filter(c => {
                return broker.companiesContract.findIndex(i => c._id === i._id) === -1
            }));
            setEditModal(true);
            dispatch(clearBrokersErrors());
        }
    };

    const inputChangeHandler = (e) => {
        const {name, value} = e.target;
        isAdd
            ? setNewData(prev => ({...prev, [name]: value}))
            : setEditedData(prev => ({...prev, [name]: value}));
    };

    const submitFormHandler = async e => {
        e.preventDefault();
        if (isAdd) {
            const data = {...newData}
            data.phoneNumber = phoneNumbers;
            data.companiesContract = companiesContracts;
            dispatch(createBrokerRequest(data));
        } else {
            const data = {...editedData}
            data.phoneNumber = phoneNumbers;
            data.companiesContract = companiesContracts;
            dispatch(editBrokerRequest({id: brokerId, data}));
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
                    click={() => openCloseModal(brokerID)}
                />
            }
            <Modal
                open={isAdd ? newModal : editModal}
                onClose={() => isAdd ? setNewModal(false) : setEditModal(false)}
                aria-labelledby="transition-modal-name"
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
                                                type={'name'}
                                                name={'name'}
                                                label={'Broker name'}
                                                value={isAdd ? newData.name : editedData.name}
                                                required={true}
                                                onChange={inputChangeHandler}
                                                error={getFieldError('name')}
                                            />
                                        </Grid>

                                        {phoneNumbers.map((phone, index) => (
                                            <Grid key={index} sx={{paddingLeft: '16px'}} container spacing={2}
                                                  alignItems='center'>
                                                <Grid item xs={10} mt={2} alignItems='center'>
                                                    <MuiTelInput
                                                        error={Boolean(getFieldError('phoneNumber'))}
                                                        preferredCountries={['US']}
                                                        defaultCountry={'US'}
                                                        name={'phoneNumber'}
                                                        label={'Phone Number'}
                                                        value={phone}
                                                        required={true}
                                                        onChange={e => phoneChangeHandler(e, index)}
                                                    />
                                                    <FormHelperText sx={{
                                                        color: '#d32f2f',
                                                        margin: '3px 14px 0'
                                                    }}>{getFieldError('phoneNumber')}</FormHelperText>
                                                </Grid>

                                                <Grid key={index + phone} item xs={1} mt={2}>
                                                    <IconButton onClick={() => addPhoneNumber(index)} color="primary">
                                                        <Add/>
                                                    </IconButton>
                                                </Grid>

                                                <Grid key={index + 1} item xs={1} mt={2}>
                                                    <IconButton onClick={() => deletePhoneNumber(index)}
                                                                color="primary"
                                                                disabled={index === 0}>
                                                        <Delete/>
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        ))}

                                        {companiesContracts.map((company, index) => (
                                            <Grid key={index} sx={{paddingLeft: '16px'}} container spacing={2}
                                                  alignItems='center'>
                                                <Grid item xs={10} mt={2} alignItems='center'>
                                                    <Grid item width="100%">
                                                        <FormSelect
                                                            label={'Carriers'}
                                                            name={'companiesContract'}
                                                            array={company._id ? [company, ...availableCompanies] : availableCompanies}
                                                            value={company._id || ''}
                                                            onChange={e => companiesChangeHandler(e, index, company)}
                                                            required={true}
                                                            variant={'object'}
                                                            error={getFieldError('companiesContract')}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Grid key={index + company} item xs={1} mt={2}>
                                                    <IconButton onClick={() => addCompaniesContract(index)}
                                                                color="primary"
                                                                disabled={availableCompanies.length === 0}>
                                                        <Add/>
                                                    </IconButton>
                                                </Grid>

                                                <Grid key={index + 1} item xs={1} mt={2}>
                                                    <IconButton onClick={() => deleteCompaniesContract(index)}
                                                                color="primary"
                                                                disabled={index === 0}>
                                                        <Delete/>
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        ))}

                                        <Grid item width='100%'>
                                            <FormElement
                                                name={'mc'}
                                                label={'MC'}
                                                value={isAdd ? newData.mc : editedData.mc}
                                                required={true}
                                                onChange={inputChangeHandler}
                                                error={getFieldError('mc')}
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

export default BrokersModal;