import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {Box, Grid, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import ButtonWithProgress from "../UI/Button/ButtonWithProgress/ButtonWithProgress";
import {addAttachmentRequest} from "../../store/actions/tripsActions";
import FileInput from "../UI/Form/FileInput/FileInput";

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



const NewAttachment = ({open, handleClose, id}) => {
  const dispatch = useDispatch();
  const [attachment, setAttachment] = useState({RC: '', BOL: ''});

  const fileChangeHandler = e => {
    const name = e.target.name;
    const file = e.target.files[0];

    setAttachment(prevState => ({...prevState, [name]: file}));
  };



  const sendAttachment = () => {
    const newAttachment = attachment;
    const formData = new FormData();
    Object.keys(newAttachment).forEach(key => {
      formData.append(key, newAttachment[key]);
    });
    dispatch(addAttachmentRequest({formData, id}));
    handleClose();
    setAttachment({RC: '', BOL: ''});
  };

  return (
    <div>
      <div>
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >

          <Box sx={style}>
            <Typography id="keep-mounted-modal-description" sx={{ mb: 2 }}>
              Attach files
            </Typography>
            <Grid item sx={{marginBottom: '10px'}}>
              <FileInput name="RC" label="RC file" onChange={fileChangeHandler} required={false} accept={'.png, .jpg, .jpeg, .pdf'}/>
            </Grid>

            <Grid item>
              <FileInput name="BOL" label="BOL file" onChange={fileChangeHandler} required={false} accept={'.png, .jpg, .jpeg, .pdf'}/>
            </Grid>
            <Grid container justifyContent={'space-between'} spacing={1} my={'10px'}>
              <Grid item xs={6}>
                <ButtonWithProgress
                  fullWidth
                  type="button"
                  variant="contained"
                  onClick={sendAttachment}
                >
                  Save
                </ButtonWithProgress>
              </Grid>
              
              <Grid item xs={6}>
                <ButtonWithProgress
                  fullWidth
                  type="button"
                  variant="contained"
                  onClick={handleClose}
                >
                  Cancel
                </ButtonWithProgress>
              </Grid>
            </Grid>
          </Box>



        </Modal>
      </div>

    </div>
  );
};

export default NewAttachment;