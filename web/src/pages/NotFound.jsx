import { Box } from '@mui/material';

export const NotFound = () => {
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
        Error: 404 page not found
      </h1>
      <p className="mt-0">Sorry, the page you&apos;re looking for cannot be accessed</p>
    </Box>
  );
};
