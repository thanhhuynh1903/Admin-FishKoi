import React, { useState, useEffect } from 'react';
import { aget, aupdate, apatch } from 'utils/util_axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import PreviewIcon from '@mui/icons-material/Preview';
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

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setUpdatedData((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      let response;
      if (nameapi === 'products') {
        // Check if only isApproved status is updated
        if ('isApproved' in updatedData) {
          response = await apatch(`/${nameapi}/${statuid}/approve`, { isApproved: updatedData.isApproved });
        } else {
          response = await aupdate(`/${nameapi}/${statuid}`, {
            name: updatedData.name,
            description: updatedData.description,
            price: updatedData.price,
            image: updatedData.image // assuming imageUrl is part of updatedData
          });
        }
      } else {
        response = await aupdate(`/${nameapi}/${statuid}`, updatedData);
      }
      setData(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating data', error);
    } finally {
      refresh();
    }
  };

  let fields;
  if (nameapi === 'package') {
    fields = ['name', 'description', 'price'];
  } else if (nameapi === 'products') {
    fields = ['name', 'description', 'price', 'createdAt', 'image', 'owner', 'isApproved', 'avgRating', 'totalReviews'];
  } else {
    fields = ['title', 'description', 'price', 'sellerId', 'fengShuiTags'];
  }

  return (
    <span>
      <span onClick={handleEditClick}>{nameapi === 'products' ? <PreviewIcon /> : <ModeEditOutlineOutlinedIcon />}</span>
      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        {nameapi === 'products' ? <DialogTitle>View detail {nameapi}</DialogTitle> : <DialogTitle>Edit {nameapi}</DialogTitle>}
        <DialogContent>
          {fields.map((field) =>
            field === 'isApproved' ? (
              <FormControlLabel key={field} control={<Switch checked={updatedData[field]} name={field} />} label="Is Approved" />
            ) : field === 'avgRating' || field === 'totalReviews' ? (
              data.avgRating && data.totalReviews ? (
                <TextField
                  disabled
                  key={field}
                  margin="dense"
                  name={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={updatedData[field] || ''}
                  onChange={handleChange}
                  sx={{ fontSize: '16px' }}
                />
              ) : (
                <p key={field}>Don't have rating or review</p>
              )
            ) : field === 'image' ? (
              <div key={field} style={{ width: '100%' }}>
                <img src={updatedData[field]} alt="Product" style={{ width: '100%', maxHeight: '50%', objectFit: 'cover' }} />
                <TextField
                  margin="dense"
                  name={field}
                  label="Image URL"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={updatedData[field] || ''}
                  onChange={handleChange}
                  sx={{ fontSize: '16px', marginTop: '10px' }}
                />
              </div>
            ) : (
              <TextField
                key={field}
                margin="dense"
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                type={field === 'price' ? 'number' : 'text'}
                fullWidth
                variant="outlined"
                value={field === 'owner' ? updatedData[field]?.name || '' : updatedData[field] || ''}
                onChange={handleChange}
                multiline={field === 'description'}
                rows={field === 'description' ? 6 : undefined}
                maxRows={field === 'description' ? 6 : undefined}
                sx={{ fontSize: '16px' }}
              />
            )
          )}
        </DialogContent>
        {nameapi === 'products' ? (
          ''
        ) : (
          <DialogActions>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogActions>
        )}
      </Dialog>
    </span>
  );
}
