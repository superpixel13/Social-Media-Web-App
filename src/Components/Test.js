import React from 'react';
import Button from '@material-ui/core/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import { Fab } from '@material-ui/core';
function MyApp() {
  const { enqueueSnackbar } = useSnackbar();



  const handleClickVariant = (variant) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('Post Liked', { variant });
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickVariant("success")}>
        {" "}
        <Fab color="primary" size="small">
          <ThumbUpAltIcon />
        </Fab>
      </Button>
    </React.Fragment>
  );
}

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <MyApp />
    </SnackbarProvider>
  );
}