import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { aget, adelete } from 'utils/util_axios';
import ComponentSkeleton from './ComponentSkeleton';
import Modalcreate from './Package-components/ModalcreatePackage';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Typography from '@mui/material/Typography'; // Ensure correct import
import ModalEdit from './ModalEdit';
const columns = (fetchApi) => [
  { field: 'id', headerName: 'ID', width: 200 },
  {
    field: 'name',
    headerName: 'name',
    width: 200,

  },
  { field: 'price', headerName: 'price', width: 140 },
  { field: 'date', headerName: 'date', width: 180 },
  { field: 'numberOfPosted', headerName: 'Number of posted', width: 150 },
  { field: 'description', headerName: 'description', width: 200 },
  {
    field: 'Action',
    headerName: '',
    width: 150,
    renderCell: (params) => {
        
      const handleDeleteConsul = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this package?');
        if (!confirmed) return; // Cancel deletion if the user does not confirm

        try {
          await adelete(`/package/delete/${params.id}`); // Use params.row.id
          fetchApi(); // Refresh the data after deletion
        } catch (error) {
          console.error('Failed to delete consultation:', error);
        }
      };

      return (
        <div style={{ zIndex: 10, textAlign: 'end' }}>
          <span style={{ cursor: 'pointer', marginX: 1 }}>
            <ModalEdit statuid={params.id} nameapi={"package"} refresh={fetchApi}/>
          </span>
          <span  onClick={handleDeleteConsul} style={{ cursor: 'pointer', marginX: 1,display:  params.row.numberOfPosted > 0 ? 'none' : ''}}>
            <DeleteForeverOutlinedIcon />
          </span>
        </div>
      );
    }
  }
];

const paginationModel = { page: 0, pageSize: 5 };

export default function Package() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
      const res = await aget('/package');
      const packagedata = res.data.map((pack) => ({
        id: pack._id,
        name: pack.name,
        price: pack.price,
        date: pack.createdAt,
        description: pack.description,
        numberOfPosted: pack.numberOfPosted
      }));
      setData(packagedata);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <ComponentSkeleton>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Package</h2>
        <Modalcreate refresh={fetchApi} />
      </div>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns(fetchApi)}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0, zIndex: 5 }}
        />
      </Paper>
    </ComponentSkeleton>
  );
}
