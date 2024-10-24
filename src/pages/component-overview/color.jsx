import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Grid from '@mui/system/Unstable_Grid';
import ComponentSkeleton from './ComponentSkeleton';
import { aget } from 'utils/util_axios';
import ModalPopup from './ModalPopup';
import BasicPagination from './BasicPagination';
import Modalcreate from './Blog-components/Modalcreate';
const ITEMS_PER_PAGE = 6;

const EllipsisTypography = styled(Typography)({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3, // Change this to the number of lines you want to display before truncating
  textOverflow: 'ellipsis'
});

export default function ComponentColor() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const paginationRef = useRef();

  useEffect(() => {
    fetchApi();
  }, []);

const fetchApi = async () =>{
    await aget('/blog').then((res) => {
      setData(res.data);
    });
  }
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item._id !== id));
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Paginate data
  const paginatedData = data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <ComponentSkeleton>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Blogs</h2>
        <Modalcreate refresh={fetchApi} />
      </div>
      <Grid container spacing={3}>
        {paginatedData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    R
                  </Avatar>
                }
                action={<ModalPopup blog={item} onDelete={handleDelete} />}
                title={"Alex xansdera"}
                subheader={`${formatDate(item.createAt)} Update: ${formatDate(item.updatedAt)}`}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary', marginLeft: 2, marginBottom: 1 }}>
                {item.title}
              </Typography>
              <CardMedia component="img" height="194" image={item.picture} alt="Paella dish" />
              <CardContent>
                <EllipsisTypography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.content}
                </EllipsisTypography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <BasicPagination
        ref={paginationRef}
        count={Math.ceil(data.length / ITEMS_PER_PAGE)}
        page={page}
        onChange={handleChangePage}
      />
    </ComponentSkeleton>
  );
}
