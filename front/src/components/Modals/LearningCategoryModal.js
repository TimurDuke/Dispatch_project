import React, {useEffect, useState} from 'react';
import {Box, Fade, Grid, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import FormElement from "../UI/Form/FormElement/FormElement";
import ButtonWithProgress from "../UI/Button/ButtonWithProgress/ButtonWithProgress";
import AddButton from "../UI/Button/AddButton/AddButton";
import {addLearningCategoryRequest, clearLearningCategoryErrors} from "../../store/actions/learningsActions";

const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  padding: '20px'
};

const LearningCategoryModal = ({modalTitle}) => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.learnings.categories);
  const addCategoryError = useSelector(state => state.learnings.addCategoryError);
  const addCategoryLoading = useSelector(state => state.learnings.addCategoryLoading);

  const [newData, setNewData] = useState({title: ''});
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (addCategoryError === null) {
      setModal(false);
    }
    // eslint-disable-next-line
  }, [categories]);

  const openCloseModal = () => {
      setNewData({title: ''});
      setModal(true);
      dispatch(clearLearningCategoryErrors());
  };

  const inputChangeHandler = (e) => {
    setNewData(prev => ({...prev, title: e.target.value}));
  };

  const submitFormHandler = e => {
    e.preventDefault();
    dispatch(addLearningCategoryRequest(newData));
  };

  const getFieldError = fieldName => {
    try {
      return addCategoryError.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <>
      <AddButton click={openCloseModal}/>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
      >
        <Fade in={modal}>
          <Box sx={style}>
            <div>
              <Grid>
                <Typography variant={'h6'} marginBottom={'20px'}>
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
                        label={'Category title'}
                        value={newData.title}
                        required={true}
                        onChange={inputChangeHandler}
                        error={getFieldError('title')}
                        multiline={true}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={6}>
                    <ButtonWithProgress
                      loading={addCategoryLoading}
                      disabled={addCategoryLoading}
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
                      onClick={() => setModal(false)}
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

export default LearningCategoryModal;