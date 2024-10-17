import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { aget, adelete } from 'utils/util_axios';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import IronIcon from '@mui/icons-material/Iron';
import GrassIcon from '@mui/icons-material/Grass';
import PublicIcon from '@mui/icons-material/Public';
import Button from '@mui/material/Button';
import ComponentSkeleton from './ComponentSkeleton';
import Modalcreate from './Consultation-components/Modalcreate';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Typography from '@mui/material/Typography'; // Ensure correct import

const columns = (fetchApi) => [
  { field: 'id', headerName: 'ID', width: 200 },
  {
    field: 'element',
    headerName: 'Element',
    width: 200,
    renderCell: (params) => {
      let Icon;
      let color;

      switch (params.value) {
        case 'Fire':
          Icon = <LocalFireDepartmentIcon color="error" />;
          color = '#ff4d4f';
          break;
        case 'Metal':
          Icon = <IronIcon color="secondary" />;
          color = '#8c8c8c';
          break;
        case 'Water':
          Icon = <WaterDropIcon color="primary" />;
          color = '#1677ff';
          break;
        case 'Wood':
          Icon = <GrassIcon color="success" />;
          color = '#90d96c';
          break;
        default:
          Icon = <PublicIcon color="info" />;
          color = '#43cece';
          break;
      }

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 'bold' }}>
          {Icon}
          <span style={{ color: color }}>{params.value}</span>
        </div>
      );
    }
  },
  { field: 'suitableColors', headerName: 'Suitable Colors', width: 300 },
  { field: 'fishPondPlacement', headerName: 'Fish Pond Placement', width: 250 },
  {
    field: 'Action',
    headerName: '',
    width: 150,
    renderCell: (params) => {
        console.log(params.id);
        
      const handleDeleteConsul = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this consultation?');
        if (!confirmed) return; // Cancel deletion if the user does not confirm

        try {
          await adelete(`/consultation/delete/${params.id}`); // Use params.row.id
          fetchApi(); // Refresh the data after deletion
        } catch (error) {
          console.error('Failed to delete consultation:', error);
        }
      };

      return (
        <div style={{ zIndex: 10, textAlign: 'end' }}>
          <Typography sx={{ cursor: 'pointer', marginX: 1 }}>
            <ModeEditOutlineOutlinedIcon sx={{ cursor: 'pointer', marginX: 1 }} />
          </Typography>
          <Typography onClick={handleDeleteConsul} sx={{ cursor: 'pointer', marginX: 1 }}>
            <DeleteForeverOutlinedIcon />
          </Typography>
        </div>
      );
    }
  }
];

const paginationModel = { page: 0, pageSize: 5 };

export default function Consultation() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
      const res = await aget('/consultation');
      const consuldata = res.data.map((consul) => ({
        id: consul._id,
        element: consul.element,
        suitableColors: consul.suitableColors.join(','),
        meaning: consul.meaning,
        fishPondPlacement: consul.fishPondPlacement,
        limitations: consul.limitations,
        note: consul.note
      }));
      setData(consuldata);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <ComponentSkeleton>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Consultation</h2>
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
