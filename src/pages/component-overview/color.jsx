import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Grid from '@mui/system/Unstable_Grid';
import ComponentSkeleton from './ComponentSkeleton';
import { useState, useEffect } from 'react';
import { aget } from 'utils/util_axios';
import ModalPopup from './ModalPopup';

export default function ComponentColor() {
  const [data, setData] = useState([]);

  useEffect(() => {
    aget('/blog').then((res) => {
      setData(res.data);
    });
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item._id !== id));
  };

  return (
    <ComponentSkeleton>
      <Grid container spacing={3}>
        {data.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    R
                  </Avatar>
                }
                action={
                  <ModalPopup blog={item} onDelete={handleDelete} />
                }
                title={item.title}
                subheader={`${formatDate(item.createdAt)} Update: ${formatDate(item.updatedAt)}`}
              />
              <CardMedia component="img" height="194" image={item.picture} alt="Paella dish" />
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </ComponentSkeleton>
  );
}
