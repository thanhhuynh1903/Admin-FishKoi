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
import { postBlogPost } from 'utils/util_axios';
import { useState, useEffect,useRef  } from 'react';
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

const StyledUploadBox = styled('div')(({ theme }) => `
  border: 2px dashed ${grey[300]};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${blue[400]};
    background-color: ${grey[50]};
  }

  &.dragover {
    border-color: ${blue[500]};
    background-color: ${blue[100]};
  }
`);

const StyledFileInput = styled('input')`
  display: none;
`;

const ImagePreview = styled('img')`
  max-width: 100%;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 4px;
`;

export default function Modalcreate({ refresh }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorId: '60d0fe4f5311236168a109ca',
    picture: null // Changed to null since we'll store the file object
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        picture: file
      }));
      
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        picture: file
      }));
      
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleSubmit = async () => {
    const { title, content, authorId, picture } = formData;

    try {
      // Using postBlogPost function to send the file along with other data
      const response = await postBlogPost('/blog', { title, content, authorId, picture });
      console.log('Response:', response); // Updated to directly log response
      refresh();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }

  };

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      content: '',
      authorId: '60d0fe4f5311236168a109ca',
      picture: null
    });
    setPreviewUrl('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
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
          <h2 style={{ textAlign: 'center', marginTop: '0px', marginBottom: '0px' }}>
            Create New Blog Post
          </h2>
          <FormControl defaultValue="">
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                <Label>Title</Label>
                <TextField
                  sx={{ width: '100%' }}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter post title"
                />
                <HelperText />
              </Grid>
              <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                <Label>Image Upload</Label>
                <StyledUploadBox
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <StyledFileInput
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {previewUrl ? (
                    <div>
                      <ImagePreview src={previewUrl} alt="Preview" />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Click or drag to change image
                      </Typography>
                    </div>
                  ) : (
                    <Typography>
                      Drag and drop an image here, or click to select
                    </Typography>
                  )}
                </StyledUploadBox>
                <HelperText />
              </Grid>
              <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                <Label>Content</Label>
                <Textarea
                  sx={{ width: '100%' }}
                  name="content"
                  aria-label="minimum height"
                  value={formData.content}
                  onChange={handleChange}
                  minRows={3}
                  placeholder="Minimum 3 rows"
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

