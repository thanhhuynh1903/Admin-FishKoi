import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import IronIcon from '@mui/icons-material/Iron';
import GrassIcon from '@mui/icons-material/Grass';
import PublicIcon from '@mui/icons-material/Public';
import { aget } from 'utils/util_axios';
import { useEffect, useState, useRef } from 'react';
import ComponentSkeleton from './ComponentSkeleton';
import Popover from '@mui/material/Popover';
import BasicPagination from './BasicPagination';
import ConsultationSearch from './Consultation-components/CardSearch';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'start',
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
    display: 'block'
  })
}));
const ITEMS_PER_PAGE = 4;

export default function Consultation() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState(null);
  const paginationRef = useRef();
  const [page, setPage] = useState(1);
  console.log(filteredData);
  const [sortOrder, setSortOrder] = useState(null); // State for sort order

  useEffect(() => {
    fetchApi();
  }, []);

  useEffect(() => {
    let sortedData = [...filteredData];

    if (sortOrder) {
      sortedData.sort((a, b) => {
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      });
    }

    setFilteredData(sortedData);
  }, [sortOrder]);

  const fetchApi = async () => {
    try {
      const res = await aget('/consultation');
      setData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleFilterChange = ({ search, element, sort }) => {
    let result = data;

    // Filter by search term
    if (search) {
      result = result.filter(
        (item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.menh.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by element
    if (element) {
      result = result.filter((item) => item.menh === element);
    }

    if (sort) {
      setSortOrder(sort);
    }

    setFilteredData(result);
    setPage(1);
  };

  const chooseIcon = (id, params, value) => {
    let Icon;
    let color;

    switch (params) {
      case 'Hỏa':
        Icon = <LocalFireDepartmentIcon color="error" sx={{ fontSize: 40 }} />;
        color = '#ff4d4f';
        break;
      case 'Kim':
        Icon = <IronIcon color="secondary" sx={{ fontSize: 40 }} />;
        color = '#8c8c8c';
        break;
      case 'Thủy':
        Icon = <WaterDropIcon color="primary" sx={{ fontSize: 40 }} />;
        color = '#1677ff';
        break;
      case 'Mộc':
        Icon = <GrassIcon color="success" sx={{ fontSize: 40 }} />;
        color = '#90d96c';
        break;
      default:
        Icon = <PublicIcon color="info" sx={{ fontSize: 40 }} />;
        color = '#43cece';
        break;
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          fontSize: '17px',
          fontWeight: 'bold',
          width: '100%',
          height: '40px'
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ alignContent: 'center' }}>{Icon}</div>
          <div style={{ marginLeft: '15px' }}>
            <h5 style={{ margin: '0px 0px', color: '#7F8FA4' }}>Cung : {value}</h5>
            <h4 style={{ margin: '0px 0px', fontSize: '13.5px', color: color }}>Mệnh : {params}</h4>
          </div>
        </div>
        <div>ID : {id}</div>
      </div>
    );
  };

  const handlePopoverOpen = (event, content) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(content);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverContent(null);
  };

  const open = Boolean(anchorEl);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const paginatedData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalCount = filteredData.length;

  // Calculate the range for the current page
  const start = (page - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(start + ITEMS_PER_PAGE - 1, totalCount);

  return (
    <ComponentSkeleton>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Consultation</h2>
      </div>
      <Grid container>
        <Grid xs container sx={{ borderBottom: '1px solid #DBE0E4' }}>
          <Grid xs={9}>
            {paginatedData.map((item) => (
              <Paper
                key={item.id}
                sx={(theme) => ({
                  margin: 'auto',
                  maxWidth: 1000,
                  flexGrow: 1,
                  marginBottom: 3,
                  border: '1px solid #DBE0E4',
                  backgroundColor: '#fff',
                  ...theme.applyStyles('dark', {
                    backgroundColor: '#1A2027'
                  })
                })}
              >
                <Grid container item sx={{ borderBottom: '1px solid #DBE0E4', p: 2, backgroundColor: '#f5f5f5' }}>
                  {chooseIcon(item.id, item.menh, item.name)}
                </Grid>

                <Grid container>
                  <Grid xs container sx={{ borderBottom: '1px solid #DBE0E4' }}>
                    <Grid xs={3}>
                      <Item sx={{ paddingY: 3, borderRadius: '0px', boxShadow: 0, borderRight: '1px solid #DBE0E4' }}>
                        <Typography component="span" sx={{ fontWeight: 700, fontSize: '12px' }}>
                          Hướng chủ đạo ({item?.pondDirections?.mainDirections?.length})
                        </Typography>
                        <Typography component="p" sx={{ marginTop: 1 }}>
                          {item?.pondDirections?.mainDirections?.map((itemchild) => itemchild).join(', ')}
                        </Typography>
                      </Item>
                    </Grid>
                    <Grid xs={3}>
                      <Item sx={{ paddingY: 3, borderRadius: '0px', boxShadow: 0, borderRight: '1px solid #DBE0E4' }}>
                        <Typography component="span" sx={{ fontWeight: 700, fontSize: '12px' }}>
                          Sinh khí ({item?.pondDirections?.lifeEnergy?.length})
                        </Typography>
                        <Typography component="p" sx={{ marginTop: 1 }}>
                          {item?.pondDirections?.lifeEnergy?.map((direction) => direction).join(', ')}
                        </Typography>
                      </Item>
                    </Grid>
                    <Grid xs={3}>
                      <Item sx={{ paddingY: 3, borderRadius: '0px', boxShadow: 0, borderRight: '1px solid #DBE0E4' }}>
                        <Typography component="span" sx={{ fontWeight: 700, fontSize: '12px' }}>
                          Phong thủy sinh tài ({item?.pondDirections?.wealthEnergy?.length})
                        </Typography>
                        <Typography component="p" sx={{ marginTop: 1 }}>
                          {item?.pondDirections?.wealthEnergy?.map((direction) => direction).join(', ')}
                        </Typography>
                      </Item>
                    </Grid>
                    <Grid xs={3}>
                      <Item sx={{ paddingY: 3, borderRadius: '0px', boxShadow: 0, borderRight: '1px solid #DBE0E4' }}>
                        <Typography component="span" sx={{ fontWeight: 700, fontSize: '12px' }}>
                          Phong thủy tiền tài ({item?.pondDirections?.moneyEnergy?.length})
                        </Typography>
                        <Typography component="p" sx={{ marginTop: 1 }}>
                          {item?.pondDirections?.moneyEnergy?.map((itemchild) => itemchild).join(', ')}
                        </Typography>
                      </Item>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid xs={12} container>
                    <Grid xs={6} sx={{ borderRadius: '0px', boxShadow: 0, borderRight: '1px solid #DBE0E4' }}>
                      <Grid item sx={{ p: 2 }}>
                        <Typography gutterBottom variant="subtitle1" component="div" color="error">
                          Hạn Chế:
                        </Typography>
                        <Typography variant="body2" gutterBottom sx={{ fontSize: '14px' }}>
                          <Typography component="span" sx={{ fontWeight: 700, fontSize: '15px' }}>
                            Màu sắc :{' '}
                          </Typography>
                          {item?.limitations?.colors?.map((itemchild) => itemchild).join(', ')}
                        </Typography>
                        <Typography variant="body" gutterBottom>
                          <Typography component="span" sx={{ fontWeight: 700, fontSize: '13.5px' }}>
                            Hướng :{' '}
                          </Typography>
                          {item?.limitations?.directions?.map((itemchild) => itemchild).join(', ')}
                        </Typography>
                        <Typography variant="body2">
                          <Typography component="span" sx={{ fontWeight: 700, fontSize: '13.5px' }}>
                            Không nên :{' '}
                          </Typography>
                          {item?.limitations?.quantity}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '13.5px' }}>
                          <Typography component="span" sx={{ fontWeight: 700, fontSize: '13.5px' }}>
                            Lí do :{' '}
                          </Typography>
                          {item?.limitations?.reason}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid item xs={6} container>
                      <Grid item xs={12} sx={{ borderBottom: '1px solid #DBE0E4' }}>
                        <Item sx={{ borderRadius: '0px', boxShadow: 0, borderRight: '1px solid #DBE0E4' }}>
                          <Typography gutterBottom variant="subtitle1" component="div" color="rgb(144, 217, 108)">
                            Số may mắn : ({item?.luckyNumbers?.length})
                          </Typography>
                          <Typography component="p" sx={{ marginTop: 1 }}>
                            {item?.luckyNumbers?.map((direction) => direction).join(', ')}
                          </Typography>
                        </Item>
                      </Grid>
                      <Grid item xs={12} sx={{ p: 1 }}>
                        <Typography variant="subtitle1" component="div" color="#4FB5DD">
                          Màu phong thủy:
                        </Typography>
                        <Typography variant="body">
                          <Typography component="span" sx={{ fontWeight: 700, fontSize: '12px' }}>
                            Màu chủ đạo :{' '}
                          </Typography>
                          {item?.suitableColors?.mainColors?.map((itemchild) => itemchild).join(', ')}
                        </Typography>
                        {item?.suitableColors?.primary.length > 0 && (
                          <Typography
                            sx={{ cursor: 'pointer' }}
                            onMouseEnter={(e) =>
                              handlePopoverOpen(e, {
                                name: item.name,
                                info: `Ý nghĩa : ${item?.suitableColors?.primary?.map((itemchild) => itemchild?.meaning)}`
                              })
                            }
                            onMouseLeave={handlePopoverClose}
                          >
                            <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
                              <Typography component="span" sx={{ fontWeight: 700, fontSize: '12px' }}>
                                #1 :{' '}
                              </Typography>
                              {item?.suitableColors?.primary?.map((itemchild) => itemchild?.color).join(', ')}
                            </Typography>
                            <Typography variant="body2">
                              <Typography component="span" sx={{ fontWeight: 700, fontSize: '12px' }}>
                                Mã màu :{' '}
                              </Typography>
                              {item?.suitableColors?.primary?.map((itemchild) => itemchild?.hexCode).join(', ')}
                            </Typography>
                          </Typography>
                        )}
                        {item?.suitableColors?.secondary.length > 0 && (
                          <Typography
                            sx={{ cursor: 'pointer' }}
                            onMouseEnter={(e) =>
                              handlePopoverOpen(e, {
                                name: item.name,
                                info: `Ý nghĩa : ${item?.suitableColors?.secondary?.map((itemchild) => itemchild?.meaning)}`
                              })
                            }
                            onMouseLeave={handlePopoverClose}
                          >
                            <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
                              <Typography component="span" sx={{ fontWeight: 700, fontSize: '12px' }}>
                                #2 :{' '}
                              </Typography>
                              {item?.suitableColors?.secondary?.map((itemchild) => itemchild?.color).join(', ')}
                            </Typography>
                            <Typography variant="body2">
                              <Typography component="span" sx={{ fontWeight: 700, fontSize: '12px' }}>
                                Mã màu :{' '}
                              </Typography>
                              {item?.suitableColors?.secondary?.map((itemchild) => itemchild?.hexCode).join(', ')}
                            </Typography>
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid xs item sx={{ borderBottom: '1px solid #DBE0E4', p: 2, backgroundColor: '#f5f5f5', display: 'flex' }}>
                  <Typography variant="span" sx={{ fontSize: '15px' }}>
                    <Typography component="body2" sx={{ fontWeight: 700, fontSize: '13.5px' }}>
                      Chú ý :{' '}
                    </Typography>
                    {item?.pondDirections?.note}
                  </Typography>
                </Grid>
              </Paper>
            ))}
          </Grid>
          <Grid xs={3}>
            <ConsultationSearch onFilterChange={handleFilterChange} />
          </Grid>
        </Grid>
      </Grid>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none'
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{popoverContent?.info}</Typography>
      </Popover>
      <Typography sx={{ display: 'flex', textAlign: 'center', alignItems: 'center',justifyContent:'center' }}>
        <Typography component="div" sx={{ marginRight: 2 }}>
          {start}-{end} of {totalCount}
        </Typography>
        <BasicPagination
          ref={paginationRef}
          count={Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handleChangePage}
        />
      </Typography>
    </ComponentSkeleton>
  );
}
