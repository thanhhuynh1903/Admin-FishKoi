import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
// project import
import MainCard from 'components/MainCard';
import ComponentWrapper from './ComponentWrapper';
import ComponentSkeleton from './ComponentSkeleton';
import { aget } from 'utils/util_axios';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import IronIcon from '@mui/icons-material/Iron';
import GrassIcon from '@mui/icons-material/Grass';
import PublicIcon from '@mui/icons-material/Public';
import { styled } from '@mui/system';

// Custom styled Grid item with hover animation
const AnimatedGridItem = styled(Grid)(({ theme }) => ({
  transition: 'transform 0.3s ease-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

// Custom styled MainCard with hover shadow
const HoverShadowCard = styled(MainCard)(({ theme }) => ({
  transition: 'box-shadow 0.3s ease-out',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

// ===============================|| SHADOW BOX ||=============================== //

function ShadowBox({ shadow, data }) {
  return (
    <HoverShadowCard border={false} shadow={shadow} boxShadow>
      <Stack spacing={1} justifyContent="center" alignItems="center">
        {data.element === 'thủy' ? (
          <WaterDropIcon color="primary" />
        ) : data.element === 'thổ' ? (
          <PublicIcon color="info" />
        ) : data.element === 'hỏa' ? (
          <LocalFireDepartmentIcon color="error" />
        ) : data.element === 'mộc' ? (
          <GrassIcon color="success" />
        ) : (
          <IronIcon color="secondary" />
        )}
        <Typography variant="h6">
          <strong>location:</strong> {data.location}
        </Typography>
        <Typography variant="h6">
          <strong>element:</strong> {data.element}
        </Typography>
        <Typography variant="h6">
          <strong>DOB:</strong> {data.birthYear}
        </Typography>
      </Stack>
    </HoverShadowCard>
  );
}

// ===============================|| CUSTOM - SHADOW BOX ||=============================== //

function CustomShadowBox({ shadow, label, color, bgcolor }) {
  return (
    <HoverShadowCard border={false} shadow={shadow} boxShadow sx={{ bgcolor: bgcolor || 'inherit' }}>
      <Stack spacing={1} justifyContent="center" alignItems="center">
        <Typography variant="subtitle1" color={color}>
          {label}
        </Typography>
      </Stack>
    </HoverShadowCard>
  );
}

// ============================|| COMPONENT - SHADOW ||============================ //

export default function ComponentShadow() {
  const theme = useTheme();
  const [Data, setData] = useState([]);
  useEffect(() => {
    const fetchPond = async () => {
      try {
        const response = await aget('/pond');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchPond();
  }, []);

  console.log(Data);

  return (
    <ComponentSkeleton>
      <h2>Pond</h2>
      <ComponentWrapper sx={{padding:0}}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title="Basic Shadow">
              <Grid container spacing={3}>
                {Data.map((item) => (
                  <AnimatedGridItem key={item._id} item xs={6} sm={4} md={3} lg={2}>
                    <ShadowBox shadow="7" data={item} />
                  </AnimatedGridItem>
                ))}
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard title="Custom Shadow">
              <Grid container spacing={3}>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox shadow={theme.customShadows.z1} label="z1" color="inherit" />
                </AnimatedGridItem>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard title="Color Shadow">
              <Grid container spacing={3}>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox
                    color={theme.palette.primary.contrastText}
                    bgcolor={theme.palette.primary.main}
                    shadow={theme.customShadows.primaryButton}
                    label="primary"
                  />
                </AnimatedGridItem>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox
                    color={theme.palette.secondary.contrastText}
                    bgcolor={theme.palette.secondary.main}
                    shadow={theme.customShadows.secondaryButton}
                    label="secondary"
                  />
                </AnimatedGridItem>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox
                    color={theme.palette.success.contrastText}
                    bgcolor={theme.palette.success.main}
                    shadow={theme.customShadows.successButton}
                    label="success"
                  />
                </AnimatedGridItem>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox
                    color={theme.palette.warning.contrastText}
                    bgcolor={theme.palette.warning.main}
                    shadow={theme.customShadows.warningButton}
                    label="warning"
                  />
                </AnimatedGridItem>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox
                    color={theme.palette.info.contrastText}
                    bgcolor={theme.palette.info.main}
                    shadow={theme.customShadows.infoButton}
                    label="info"
                  />
                </AnimatedGridItem>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox
                    color={theme.palette.error.contrastText}
                    bgcolor={theme.palette.error.main}
                    shadow={theme.customShadows.errorButton}
                    label="error"
                  />
                </AnimatedGridItem>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox color={theme.palette.primary.main} shadow={theme.customShadows.primary} label="primary" />
                </AnimatedGridItem>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox color={theme.palette.secondary.main} shadow={theme.customShadows.secondary} label="secondary" />
                </AnimatedGridItem>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox color={theme.palette.success.main} shadow={theme.customShadows.success} label="success" />
                </AnimatedGridItem>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox color={theme.palette.warning.main} shadow={theme.customShadows.warning} label="warning" />
                </AnimatedGridItem>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox color={theme.palette.info.main} shadow={theme.customShadows.info} label="info" />
                </AnimatedGridItem>
                <AnimatedGridItem item xs={6} sm={4} md={3} lg={2}>
                  <CustomShadowBox color={theme.palette.error.main} shadow={theme.customShadows.error} label="error" />
                </AnimatedGridItem>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </ComponentWrapper>
    </ComponentSkeleton>
  );
}

ShadowBox.propTypes = { shadow: PropTypes.string, data: PropTypes.object };

CustomShadowBox.propTypes = { shadow: PropTypes.string, label: PropTypes.string, color: PropTypes.string, bgcolor: PropTypes.string };
