// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { toast } from 'react-toastify';
import { API_ROOT, TAB_URLS } from '~/utils/constants';
import authorizedAxiosInstance from '~/utils/authorizedAxios';
import { Button } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { handleLogoutApi } from '~/apis';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/dashboards/access`);
      setUser(res.data);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await handleLogoutApi();

    // Step 2 (options) Clear user data state and navigate to Login page
    // setUser(null); // Navigate to Login page -> Don't need reset user state
    navigate('/login');
  };

  const getDefaultActiveTab = () => {
    let activeTab = TAB_URLS.DASHBOARD;
    Object.values(TAB_URLS).forEach((tab) => {
      if (location.pathname.includes(tab)) activeTab = tab;
    });
    return activeTab;
  };

  const [tab, setTab] = useState(getDefaultActiveTab());
  const handleChange = (event, newTab) => {
    setTab(newTab);
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh',
        }}>
        <CircularProgress />
        <Typography>Loading dashboard user...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '0 1em',
        gap: 2,
      }}>
      <Alert
        severity="info"
        sx={{ '.MuiAlert-message': { overflow: 'hidden' }, 'width': { md: 'max-content' } }}>
        Đây là trang Dashboard sau khi user:&nbsp;
        <Typography variant="span" sx={{ 'fontWeight': 'bold', '&:hover': { color: '#fdba26' } }}>
          {user?.email}
        </Typography>
        &nbsp;đăng nhập thành công thì mới cho truy cập vào.
      </Alert>

      <Alert
        severity="success"
        variant="outlined"
        sx={{ '.MuiAlert-message': { overflow: 'hidden' }, 'width': { md: 'max-content' } }}>
        Role hiện tại của User đang đặng nhập là:&nbsp;
        <Typography variant="span" sx={{ 'fontWeight': 'bold', '&:hover': { color: '#fdba26' } }}>
          {user?.role}
        </Typography>
      </Alert>

      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              label="Dashboard"
              value={TAB_URLS.DASHBOARD}
              component={Link}
              to={`/${TAB_URLS.DASHBOARD}`}
            />
            <Tab
              label="Support"
              value={TAB_URLS.SUPPORT}
              component={Link}
              to={`/${TAB_URLS.SUPPORT}`}
            />
            <Tab
              label="Messages"
              value={TAB_URLS.MESSAGE}
              component={Link}
              to={`/${TAB_URLS.MESSAGE}`}
            />
            <Tab
              label="Revenue"
              value={TAB_URLS.REVENUE}
              component={Link}
              to={`/${TAB_URLS.REVENUE}`}
            />
            <Tab
              label="Admin Tools"
              value={TAB_URLS.ADMIN_TOOLS}
              component={Link}
              to={`/${TAB_URLS.ADMIN_TOOLS}`}
            />
          </TabList>
        </Box>
        <TabPanel value={TAB_URLS.DASHBOARD}>
          <Alert severity="success" sx={{ width: 'max-content' }}>
            Nội dung trang Dashboard chung cho tất cả các role
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.SUPPORT}>
          <Alert severity="success" sx={{ width: 'max-content' }}>
            Nội dung trang Support
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.MESSAGE}>
          <Alert severity="info" sx={{ width: 'max-content' }}>
            Nội dung trang Messages cho các role
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.REVENUE}>
          <Alert severity="warning" sx={{ width: 'max-content' }}>
            Nội dung trang Revenue
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.ADMIN_TOOLS}>
          <Alert severity="error" sx={{ width: 'max-content' }}>
            Nội dung trang Admin Tools
          </Alert>
        </TabPanel>
      </TabContext>

      <Divider />

      <Button
        type="button"
        variant="contained"
        color="info"
        size="large"
        sx={{ mt: 2, maxWidth: 'min-content', alignSelf: 'flex-end' }}
        onClick={handleLogout}>
        LOGOUT
      </Button>
    </Box>
  );
}

export default Dashboard;
