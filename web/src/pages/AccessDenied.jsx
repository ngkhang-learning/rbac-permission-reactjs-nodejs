import { Box } from '@mui/material';

export const AccessDenied = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <h1
        style={{
          marginBottom: '.40em',
        }}>
        Access Denied
      </h1>
      <p className="mt-0">Sorry, the page you&apos;re looking for cannot be accessed</p>
    </Box>
  );
};
