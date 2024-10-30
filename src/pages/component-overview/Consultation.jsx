import React from 'react';
import { Container, Typography, Card, CardContent, Grid, List, ListItem, ListItemText, Chip, Box } from '@mui/material';
import { aget } from 'utils/util_axios';
import { useEffect, useState } from 'react';
import ComponentSkeleton from './ComponentSkeleton';
export default function Consultation() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
      setLoading(true);
      const res = await aget('/consultation');
      setData(res.data);
    } catch (error) {
      console.error('Lấy dữ liệu thất bại:', error);
      setError('Failed to fetch consultation data');
    }
  };

  return (
    <ComponentSkeleton>
       <Container>
      <Typography variant="h4" gutterBottom>{data.name}</Typography>
      <Typography variant="h6" gutterBottom>Mệnh: {data.menh}</Typography>
      <Box my={2}>
        <Typography variant="h6">Lucky Numbers:</Typography>
        {data?.luckyNumbers?.map(num => (
          <Chip key={num} label={num} color="primary" style={{ marginRight: 5 }} />
        ))}
      </Box>

      <Grid container spacing={3}>
        {/* Limitations Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Limitations</Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Number Non-Multiple" secondary={data?.limitations?.numberNonMultiple} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Quantity" secondary={data?.limitations?.quantity} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Reason" secondary={data?.limitations?.reason} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Colors" />
                  <Box>
                    {data?.limitations?.colors?.map(color => (
                      <Box key={color} width={24} height={24} bgcolor={color} style={{ display: 'inline-block', marginRight: 5 }} />
                    ))}
                  </Box>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Directions" />
                  <Box>
                    {data?.limitations?.directions?.map(direction => (
                      <Chip key={direction} label={direction} style={{ marginRight: 5 }} />
                    ))}
                  </Box>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Pond Directions Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pond Directions</Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Main Directions" />
                  <Box>
                    {data?.pondDirections?.mainDirections?.map(direction => (
                      <Chip key={direction} label={direction} style={{ marginRight: 5 }} />
                    ))}
                  </Box>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Life Energy" />
                  <Box>
                    {data?.pondDirections?.lifeEnergy?.map(direction => (
                      <Chip key={direction} label={direction} style={{ marginRight: 5 }} />
                    ))}
                  </Box>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Wealth Energy" />
                  <Box>
                    {data?.pondDirections?.wealthEnergy?.map(direction => (
                      <Chip key={direction} label={direction} style={{ marginRight: 5 }} />
                    ))}
                  </Box>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Money Energy" />
                  <Box>
                    {data?.pondDirections?.moneyEnergy?.map(direction => (
                      <Chip key={direction} label={direction} style={{ marginRight: 5 }} />
                    ))}
                  </Box>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Note" secondary={data?.pondDirections?.note} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Suitable Colors Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Suitable Colors</Typography>
              <Grid container spacing={2}>
                {data?.suitableColors?.primary?.map(colorObj => (
                  <Grid item key={colorObj?.color} xs={12} md={6}>
                    <Card style={{ backgroundColor: colorObj?.hexCode }}>
                      <CardContent>
                        <Typography variant="h6" style={{ color: colorObj?.hexCode === '#FFFFFF' ? '#000' : '#FFF' }}>{colorObj?.color}</Typography>
                        <Typography style={{ color: colorObj?.hexCode === '#FFFFFF' ? '#000' : '#FFF' }}>{colorObj?.meaning}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
    </ComponentSkeleton>
  );
}
