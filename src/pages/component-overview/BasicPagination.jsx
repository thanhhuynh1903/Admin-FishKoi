import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const BasicPagination = React.forwardRef((props, ref) => {
  return (
    <Stack spacing={2} sx={{ marginY: 3 }}>
      <Pagination
        count={10}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center' }}
        ref={ref}
        {...props}
      />
    </Stack>
  );
});

export default BasicPagination;
