import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Paper,
  InputBase,
  IconButton,
  Divider,
  List,
  Menu, 
  MenuItem, 
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import IronIcon from '@mui/icons-material/Iron';
import GrassIcon from '@mui/icons-material/Grass';
import PublicIcon from '@mui/icons-material/Public';
import MenuIcon from '@mui/icons-material/Menu';

export default function ConsultationSearch({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // State for sorting order

  const listItems = [
    {
      icon: <LocalFireDepartmentIcon color="error" />,
      primary: 'Hỏa',
      value: 'Hỏa'
    },
    {
      icon: <WaterDropIcon color="primary" />,
      primary: 'Thủy',
      value: 'Thủy'
    },
    {
      icon: <GrassIcon color="success" />,
      primary: 'Mộc',
      value: 'Mộc'
    },
    {
      icon: <IronIcon color="secondary" />,
      primary: 'Kim',
      value: 'Kim'
    },
    {
      icon: <PublicIcon color="info" />,
      primary: 'Thổ',
      value: 'Thổ'
    }
  ];

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onFilterChange({ search: value, element: selectedElement,sort: sortOrder  });
  };

  const handleElementSelect = (element) => {
    const newSelectedElement = selectedElement === element ? null : element;
    setSelectedElement(newSelectedElement);
    onFilterChange({ search: searchTerm, element: newSelectedElement,sort: sortOrder  });
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    setSelectedElement(null);
    setSortOrder(null); // Reset sort order
    onFilterChange({ search: '', element: null,sort: null });
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setAnchorEl(null); // Close the menu
    onFilterChange({ search: searchTerm, element: selectedElement, sort: order });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <Card
      sx={{
        minWidth: 275,
        marginX: 3,
        position: 'fixed',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
    >
      <CardContent sx={{ paddingBottom: '5px' }}>
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 'auto',
            marginBottom: 2
          }}
        >
          <IconButton
            sx={{ p: '10px' }}
            aria-label="menu"
            onClick={handleMenuClick} // Open sort menu on click
          >
            <MenuIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Cung,Mệnh "
            inputProps={{ 'aria-label': 'search consultation' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleClearFilter}>
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        </Paper>
      </CardContent>
      <CardActions>
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper'
          }}
        >
          {listItems.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                marginY: 1,
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                backgroundColor: selectedElement === item.value ? 'rgba(0, 0, 0, 0.1)' : 'transparent'
              }}
              onClick={() => handleElementSelect(item.value)}
            >
              <ListItemAvatar>{item.icon}</ListItemAvatar>
              <ListItemText primary={item.primary} />
            </ListItem>
          ))}
        </List>
      </CardActions>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleSort('asc')}>Sort Ascending</MenuItem>
        <MenuItem onClick={() => handleSort('desc')}>Sort Descending</MenuItem>
      </Menu>
    </Card>
  );
}
