import * as React from 'react';
import clsx from 'clsx';
import { Chip } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        justifyContent: 'left',
        '& .icon': {
          color: 'inherit',
        },
      }
    })
);

const Role = React.memo((props) => {
    const { role } = props;
    const classes = useStyles();

    return (
        <Chip
            className={clsx(classes.root, classes[role])}
            size="small"
            label={role === 0 ? 'Membre' : role === 1 ? 'Admin' : 'Professionnel'}
            variant="outlined"
        />
    );
});

const renderRoleCell = (params) => {
    return <Role role={params?.value} />;
}

export default renderRoleCell
