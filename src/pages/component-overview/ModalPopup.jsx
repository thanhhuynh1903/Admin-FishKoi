import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Modal,
  Button,
} from '@mui/material';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import { adelete } from 'utils/util_axios'; // Assuming you have adelete similar to axios.delete

const ModalPopup = ({ blog, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteBlog = async () => {
    try {
      await adelete(`/blog/${blog._id}`);
      if (onDelete) {
        onDelete(blog._id);
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton
        onClick={handleClick}
        sx={{ padding: '0px', zIndex: open ? 10 : 4 }}
      >
        {open ? <HighlightOffOutlinedIcon /> : <MoreVertIcon />}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ left: '-90px', top: '-5px', zIndex: 5 }}
      >
        <Box sx={{ p: 2, width: '150px !important' }}>
          <Typography
            onClick={handleOpenModal}
            sx={{ cursor: 'pointer', mb: 1 }}
          >
            <Link to={`/blogdetail/${blog._id}`} className="edit-link">
              View detail blog
            </Link>
          </Typography>
          <Typography
            onClick={handleOpenModal}
            sx={{ cursor: 'pointer', mb: 1 }}
          >
            Edit blog
          </Typography>
          <hr style={{ borderColor: '#FFF' }} />
          <Typography
            onClick={handleDeleteBlog}
            sx={{ cursor: 'pointer', color: 'red' }}
          >
            Delete
          </Typography>
        </Box>
      </Popover>
      {/* You can add modal for viewing/editing blog details if necessary */}
    </div>
  );
};

export default ModalPopup;
