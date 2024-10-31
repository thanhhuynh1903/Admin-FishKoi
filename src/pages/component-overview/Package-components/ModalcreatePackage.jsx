import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormControl, useFormControlContext } from '@mui/base/FormControl';
import { Input, inputClasses } from '@mui/base/Input';
import { borderRadius, styled } from '@mui/system';
import clsx from 'clsx';
import Grid from '@mui/material/Grid';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { apost } from 'utils/util_axios';
import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

const Label = styled(({ children, className }) => {
  const formControlContext = useFormControlContext();
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (formControlContext?.filled) {
      setDirty(true);
    }
  }, [formControlContext]);

  if (formControlContext === undefined) {
    return <p>{children}</p>;
  }

  const { error, required, filled } = formControlContext;
  const showRequiredError = dirty && required && !filled;

  return (
    <p className={clsx(className, error || showRequiredError ? 'invalid' : '')}>
      {children}
      {required ? ' *' : ''}
    </p>
  );
})`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  margin-bottom: 4px;

  &.invalid {
    color: red;
  }
`;

const HelperText = styled((props) => {
  const formControlContext = useFormControlContext();
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (formControlContext?.filled) {
      setDirty(true);
    }
  }, [formControlContext]);

  if (formControlContext === undefined) {
    return null;
  }

  const { required, filled } = formControlContext;
  const showRequiredError = dirty && required && !filled;

  return showRequiredError ? <p {...props}>This field is required.</p> : null;
})`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
`;

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75'
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025'
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%', // Set width to 80% for better responsiveness
  maxWidth: '600px', // Max width to control large screens
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '20px',
  p: 4
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100%; 
    max-width: 600px; 
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

export default function Modalcreate({ refresh }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    numberOfPosted:'0'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      const response = await apost('/package/create', {
        name: formData.name,
        price: formData.price, // Assuming suitableColors is a comma-separated string
        description: formData.description,
        numberOfPosted: formData.numberOfPosted
      });
      refresh();
      console.log('Response:', response.data);
      // Handle success, e.g., close modal, show success message, etc.
      setOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error, e.g., show error message, etc.
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        {' '}
        + Create
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ borderRadius: '20px' }}
      >
        <Box sx={style}>
          <h2 style={{ textAlign: 'center', marginTop: '0px', marginBottom: '0px' }}>Create new package</h2>
          <FormControl defaultValue="">
            {/* <Grid container spacing={2}>
              <Grid item xs={12} md={8}> 
                <Label>Element</Label>
                <StyledInput placeholder="Write your element here" />
                <HelperText />
              </Grid>
              <Grid item xs={12} md={4}>
                <Label>Suitable Colors</Label>
                <StyledInput placeholder="Write suitable colors here" />
                <HelperText />
              </Grid>
            </Grid> */}
            <Grid container spacing={2} mt={2}>
              {' '}
              {/* Add some margin top for spacing */}
              <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                {' '}
                {/* Use full width on small screens */}
                <Label>Name</Label>
                <TextField
                  sx={{ width: '100%' }}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Write your name here"
                />
                <HelperText />
              </Grid>
              <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                {' '}
                {/* Use full width on small screens */}
                <Label>Price</Label>
                <TextField
                  type="number"
                  sx={{ width: '100%' }}
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Write suitable colors here"
                />
                <HelperText />
              </Grid>
              <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                <Label>Description</Label>
                <Textarea
                  name="description"
                  aria-label="minimum height"
                  value={formData.description}
                  onChange={handleChange}
                  minRows={3}
                  placeholder="Minimum 3 rows"
                />
                <HelperText />
              </Grid>
              <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                <Label>Number of posted</Label>
                <TextField
                  type="number"
                  sx={{ width: '100%' }}
                  name="numberOfPosted"
                  value={formData.numberOfPosted}
                  onChange={handleChange}
                  placeholder="Write suitable colors here"
                  disabled
                />
                <HelperText />
              </Grid>
            </Grid>
            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
              <Button variant="outlined" sx={{ mx: 1 }} onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" sx={{ mx: 1 }} onClick={handleSubmit}>
                Done
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Modal>
    </div>
  );
}
