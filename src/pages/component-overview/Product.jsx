import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { aget, adelete } from 'utils/util_axios';
import ComponentSkeleton from './ComponentSkeleton';
import Modalcreate from './Package-components/ModalcreatePackage';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Typography from '@mui/material/Typography';
import ModalEdit from './ModalEdit';
import Avatar from '@mui/material/Avatar';
import { Switch } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';

const columns = (fetchApi, handleDeleteProduct) => [
  { field: 'id', headerName: 'ID', width: 200 },
  {
    field: 'name',
    headerName: 'Name',
    width: 250,
    renderCell: (params) => (
      <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
        <Avatar alt="Product image" src={params.row.image} />
        <span style={{ fontSize: '13px', marginLeft: '10px' }}>{params.value}</span>
      </div>
    )
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 200
  },
  { field: 'price', headerName: 'Price', width: 200 },
  { field: 'totalReviews', headerName: 'Reviews', width: 100 },
  {
    field: 'isApproved',
    headerName: 'Is Approved',
    width: 100,
    
    renderCell: (params) => (
      <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
        <Switch checked={params.value} />
      </div>
    )
  },
  {
    field: 'Action',
    headerName: '',
    width: 150,
    renderCell: (params) => (
      <div style={{ zIndex: 10, textAlign: 'end' }}>
        <span style={{ cursor: 'pointer', marginX: 1 }}>
          <ModalEdit statuid={params.id} nameapi={'products'} refresh={fetchApi} />
        </span>
        <span onClick={() => handleDeleteProduct(params.id)} style={{ cursor: 'pointer', marginX: 1 }}>
          <DeleteForeverOutlinedIcon />
        </span>
      </div>
    )
  }
];

const paginationModel = { page: 0, pageSize: 5 };

export default function Product() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
      const res = await aget('/products');
      const packagedata = res.data.map((pack) => ({
        id: pack._id,
        name: pack.name,
        description: pack.description,
        price: pack.price,
        image: pack.image,
        owner: pack.owner,
        isApproved: pack.isApproved,
        avgRating: pack.avgRating,
        totalReviews: pack.totalReviews
      }));
      setData(packagedata);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleDeleteProduct = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      const response = await adelete(`/products/${id}`); // Use the provided id
      setSnackbarMessage(response.data.message); // Get the message from the response
      setOpen(true); // Open the Snackbar
      await fetchApi(); // Refresh the data after deletion
    } catch (error) {
      console.error('Failed to delete product:', error);
      setSnackbarMessage('Failed to delete product.'); // Optional error message
      setOpen(true); // Open the Snackbar for the error message
    }
  };

  return (
    <ComponentSkeleton>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Products</h2>
        <Modalcreate refresh={fetchApi} />
      </div>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns(fetchApi, handleDeleteProduct)}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0, zIndex: 5 }}
        />
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Top right positioning
        open={open}
        onClose={handleClose}
        message={snackbarMessage} // Display the API message
        autoHideDuration={6000} // Automatically hide after 6 seconds
      />
    </ComponentSkeleton>
  );
}
