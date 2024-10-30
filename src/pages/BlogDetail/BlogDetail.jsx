import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { aget, aupdateBlog, adelete } from 'utils/util_axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const StyledFileInput = styled('input')({
  display: 'none'
});

const ImagePreview = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
  objectFit: 'cover',
  marginBottom: '8px'
});

const StyledUploadBox = styled('div')(
  ({ theme }) => `
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
`
);

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

export default function BlogDetail() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({ title: '', content: '', picture: '' });
  const [previewUrl, setPreviewUrl] = useState('');

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    aget(`/blog/${id}`).then((res) => {
      setData(res.data);
      setUpdatedData({ title: res.data.title, content: res.data.content, picture: res.data.picture });
      setPreviewUrl(res.data.picture); // Set the initial preview URL to the existing picture
    });
  }, [id]);

  const handleEditClick = () => {
    setEditMode(true);
  };
  
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', updatedData.title);
      formData.append('content', updatedData.content);
  
      // Only append the picture if it has been selected and is an instance of File
      if (updatedData.picture instanceof File) {
        formData.append('picture', updatedData.picture);
        console.log('Selected picture:', updatedData.picture); // Log the file object
      }
  
      const response = await aupdateBlog(`/blog/${id}`, formData);
      setData(response); // Update the state with the new data
      setEditMode(false); // Close the edit dialog
    } catch (error) {
      console.error('Error updating blog post:', error); // Improved error logging
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedData((prevState) => ({
        ...prevState,
        picture: file
      }));

      // Create a preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleDeleteBlog = async () => {
    try {
      console.log('Deltet');

      await adelete(`/blog/${id}`);
      navigate('/blog');
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div style={{ width: '100%' }}>
      <Card sx={{ maxWidth: '700px', margin: '0 auto' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              R
            </Avatar>
          }
          title={data.authorId ? 'Admin' : 'Customer'}
          subheader={'Update at :' + ' ' + formatDate(data.updatedAt)}
        />
        <Typography sx={{ marginLeft: 2, marginY: 1 }}>{data.title}</Typography>
        <CardMedia component="img" height="350px" image={data.picture} alt="Blog post image" />
        <CardContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '18px' }}>
            <strong>Description : </strong>
            {data.content}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="edit" onClick={handleEditClick}>
            <EditNoteIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={handleDeleteBlog}>
            <DeleteForeverIcon />
          </IconButton>
        </CardActions>
      </Card>

      <Dialog open={editMode} onClose={() => setEditMode(false)} sx={{width:"100% !important"}}>
        <DialogTitle>Edit Blog Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={updatedData.title}
            onChange={handleChange}
          />

          <StyledUploadBox
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <StyledFileInput ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl ? (
              <div>
                <ImagePreview src={previewUrl} alt="Preview" />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Click or drag to change image
                </Typography>
              </div>
            ) : (
              <Typography>Drag and drop an image here, or click to select</Typography>
            )}
          </StyledUploadBox>

          <TextField
            placeholder="Content edit"
            multiline
            rows={6}
            maxRows={6}
            margin="dense"
            name="content"
            label="Content"
            type="text"
            fullWidth
            variant="outlined"
            value={updatedData.content}
            onChange={handleChange}
            sx={{ fontSize: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
