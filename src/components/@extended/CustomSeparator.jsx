import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Recursive function to find the breadcrumb path
const findBreadcrumb = (menu, path) => {
  for (let item of menu) {
    if (item.url === path) {
      return [item];
    }
    if (item.children) {
      const childBreadcrumb = findBreadcrumb(item.children, path);
      if (childBreadcrumb.length) {
        return [item, ...childBreadcrumb];
      }
    }
  }
  return [];
};

function CustomSeparator({ navigation, title }) {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const paths = location.pathname.split('/').filter((x) => x);
    let breadcrumbPaths = '/';
    const crumbs = paths.map((path) => {
      breadcrumbPaths += path + '/';
      return breadcrumbPaths;
    });

    const breadcrumbs = crumbs.map((path) => findBreadcrumb(navigation.items, path)).flat();
    setBreadcrumbs(breadcrumbs);
  }, [location, navigation]);

  return (
    <Stack spacing={2} sx={{ marginY: 2 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        
        {breadcrumbs.map((crumb, index) =>
          crumb.url ? (
            <Link
              key={index}
              underline="hover"
              color="inherit"
              component={RouterLink}
              to={crumb.url}
            >
              {crumb.title}
            </Link>
          ) : (
            <Typography key={index} color="text.primary">
              {crumb.title}
            </Typography>
          )
        )}
      </Breadcrumbs>
      {title && breadcrumbs.length > 0 && (
        <Typography variant="h5">{breadcrumbs[breadcrumbs.length - 1].title}</Typography>
      )}
    </Stack>
  );
}

CustomSeparator.propTypes = {
  navigation: PropTypes.object.isRequired,
  title: PropTypes.bool
};

export default CustomSeparator;
