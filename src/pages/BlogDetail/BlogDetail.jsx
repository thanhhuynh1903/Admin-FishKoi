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
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { aget, aupdate } from 'utils/util_axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function BlogDetail() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({ title: '', content: '', picture: '' });

  useEffect(() => {
    aget(`/blog/${id}`).then((res) => {
      setData(res.data);
      setUpdatedData({ title: res.data.title, content: res.data.content, picture: res.data.picture });
    });
  }, [id]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await aupdate(`/blog/${id}`, updatedData);
      setData(response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating blog post", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div style={{ width: "100%" }}>
      <Card sx={{ maxWidth: "700px", margin: "0 auto" }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              R
            </Avatar>
          }
          
          title={data.authorId}
          subheader={formatDate(data.createdAt) + " " + "Update at :" + " " + formatDate(data.updatedAt)}
        />
        <Typography sx={{ marginLeft: 2, marginY: 1 }}>
          {data.title}
        </Typography>
        <CardMedia
          component="img"
          height="194"
          image={data.picture}
          alt="Blog post image"
        />
        <CardContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' ,fontSize:"18px"}}>
            <strong>Description : </strong>{data.content}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="edit" onClick={handleEditClick}>
            <EditNoteIcon />
          </IconButton>
          <IconButton aria-label="delete">
            <DeleteForeverIcon />
          </IconButton>
        </CardActions>
      </Card>

      <Dialog open={editMode} onClose={() => setEditMode(false)}>
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
          <TextField
            margin="dense"
            name="content"
            label="Content"
            type="text"
            fullWidth
            variant="outlined"
            value={updatedData.content}
            onChange={handleChange}
            sx={{fontSize:"16px"}}
          />
          <TextField
            margin="dense"
            name="picture"
            label="Picture URL"
            type="text"
            fullWidth
            variant="outlined"
            value={updatedData.picture}
            onChange={handleChange}
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
