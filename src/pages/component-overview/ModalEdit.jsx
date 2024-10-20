import React, { useState, useEffect } from 'react';
import { aget, aupdate } from 'utils/util_axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

export default function ModalEdit({ statuid, nameapi, refresh }) {
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    if (editMode) {
      const fetchApiId = async () => {
        try {
          const res = await aget(`/${nameapi}/${statuid}`);
          setData(res.data);
          setUpdatedData(res.data); // Initialize updatedData with fetched data
        } catch (error) {
          console.error('Failed to fetch data', error);
        }
      };
      fetchApiId();
    }
  }, [editMode, statuid, nameapi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await aupdate(`/${nameapi}/${statuid}`, updatedData);
      setData(response.data);
      setEditMode(false);
      refresh();
    } catch (error) {
      console.error('Error updating blog post', error);
    }
  };
  //   match all field by object key
  //   const field = Object.keys(data);
  let fields;
  if (nameapi === 'package') {fields = ['name', 'description', 'price'];}
  else fields = ['title', 'description', 'price','sellerId','fengShuiTags'];
  return (
    <span>
      <span onClick={handleEditClick}>
        <ModeEditOutlineOutlinedIcon />
      </span>
      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        <DialogTitle>Edit {nameapi}</DialogTitle>
        <DialogContent>
          {fields.map((field) => (
            <TextField
              key={field}
              margin="dense"
              name={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              type={field === 'price' ? 'number' : 'text'}
              fullWidth
              variant="outlined"
              value={updatedData[field] || ''}
              onChange={handleChange}
              multiline={field === 'description'}
              rows={field === 'description' ? 6 : undefined}
              maxRows={field === 'description' ? 6 : undefined}
              sx={{ fontSize: '16px' }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
