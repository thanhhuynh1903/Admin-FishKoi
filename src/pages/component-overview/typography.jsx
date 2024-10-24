import { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { aget } from 'utils/util_axios';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from './ComponentSkeleton';

const columns = [
  { field: 'id', headerName: 'ID', width: 200 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
  {
    field: 'posts',
    headerName: 'Posts',
    width: 150,
    renderCell: (params) => (
      <div style={{ color: params.value > 50 ? 'red' : 'green', fontWeight: 'bold' }}>
      {params.row.posts?.length > 0 ? params.row.posts.length : 0}
    </div>
    )
  },
  {
    field: 'age',
    headerName: 'Age',
    width: 140,
    renderCell: (params) => <div style={{ color: params.value > 50 ? 'red' : 'green', fontWeight: 'bold' }}>{params.value}</div>
  },
  {
    field: 'gender',
    headerName: 'Gender',
    width: 140
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 90
  }
];

const paginationModel = { page: 0, pageSize: 5 };

export default function ComponentTypography() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await aget('/user/allUsers');
        const users = res.data.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          posts: user.posts,
          age: new Date().getFullYear() - user.birthYear,
          gender: user.gender,
          role: user.role
        }));
        setData(users);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchApi();
  }, []);

  return (
    <ComponentSkeleton>
      <h2>User</h2>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </ComponentSkeleton>
  );
}
