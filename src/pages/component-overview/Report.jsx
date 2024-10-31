import React, { useEffect, useState } from 'react';
import { aget, adelete, apatch } from 'utils/util_axios';
import { Card, CardContent, CardMedia, Typography, Button, Select, MenuItem, Grid, Box } from '@mui/material';
import { format } from 'date-fns';
import ComponentSkeleton from './ComponentSkeleton';

export default function Report() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // New state for status filter

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await aget('/report');
        setReports(response.data);
        setFilteredReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    // Filter reports based on selected status
    const applyFilter = () => {
      if (statusFilter === 'all') {
        setFilteredReports(reports);
      } else {
        setFilteredReports(reports.filter((report) => report.status === statusFilter));
      }
    };
    applyFilter();
  }, [statusFilter, reports]);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await apatch(`/report/${reportId}`, { status: newStatus });
      setReports((prevReports) =>
        prevReports.map((report) => (report._id === reportId ? { ...report, status: newStatus } : report))
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (reportId) => {
    try {
      await adelete(`/report/${reportId}`);
      setReports((prevReports) => prevReports.filter((report) => report._id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  return (
    <ComponentSkeleton>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>

        {/* Status Filter */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">Filter by Status:</Typography>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ width: 200, marginTop: 1 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="reviewed">Reviewed</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </Select>
        </Box>

        {filteredReports.map((report) => (
          <Card key={report._id} sx={{ marginBottom: 2 }}>
            <Grid container spacing={2}>
              {/* Product Image */}
              <Grid item xs={12} sm={4}>
                <CardMedia
                  sx={{ height: 'fit-content' }}
                  component="img"
                  height="140"
                  image={report.product.image}
                  alt={report.product.name}
                />
              </Grid>
              {/* Report Content */}
              <Grid item xs={12} sm={5}>
                <CardContent>
                  <Typography variant="h6">{report.product.name}</Typography>
                  <Typography color="text.secondary" gutterBottom>
                    Reported by: {report.user.name} ({report.user.email})
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    <strong>Reason:</strong>
                    <Select value={report.reason} disabled size="small" sx={{ marginLeft: 1 }}>
                      {['inappropriate', 'fake', 'offensive', 'spam', 'other'].map((reason) => (
                        <MenuItem key={reason} value={reason}>
                          {reason.charAt(0).toUpperCase() + reason.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    <strong>Status:</strong>
                    <Select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report._id, e.target.value)}
                      size="small"
                      sx={{ marginLeft: 1 }}
                    >
                      {['pending', 'reviewed', 'resolved'].map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </Typography>
                  {/* <Box mt={2}>
                    <Button variant="contained" color="error" onClick={() => handleDelete(report._id)}>
                      Delete
                    </Button>
                  </Box> */}
                </CardContent>
              </Grid>
              <Grid sx={{ borderLeft: '1px solid grey' }} item xs={12} sm={3}>
                <CardContent>
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    <strong>Date:</strong> {format(new Date(report.createdAt), 'PPpp')}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    <strong>Description:</strong> {report.description}
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Box>
    </ComponentSkeleton>
  );
}
