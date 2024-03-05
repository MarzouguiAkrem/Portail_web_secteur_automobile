import * as React from 'react';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { ListItemText } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

const ROLE_OPTIONS = [{
    key: 'Membre',
    value: 0
}, {
    key: 'Admin',
    value: 1
}, {
    key: 'Professionnel',
    value: 2
}];
const useStyles = makeStyles(
    (theme) =>
        createStyles({
            select: {
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '5px',
            },
            optionIcon: {
                minWidth: 36,
            },
            optionText: {
                overflow: 'hidden',
            },
        })
);

const EditRole = (props) => {
    const classes = useStyles();
    const { id, value, api, field } = props;
    const handleChange = (event) => {
        const editProps = { value: event.target.value };
        if (event.key) {
            api.setEditCellProps({ id, field, props: editProps }, event);
        } else {
            api.commitCellChange({ id, field, props: editProps });
            api.setCellMode(id, field, 'view');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            api.setCellMode(id, field, 'view');
        }
    };

    return (
        <Select
            value={value}
            classes={{ select: classes.select }}
            onChange={handleChange}
            MenuProps={{
                onClose: handleClose,
            }}
            autoFocus
            fullWidth
            open
        >
            {ROLE_OPTIONS.map((option) => {
                return (
                    <MenuItem key={option.key} value={option.key}>
                        <ListItemText className={classes.optionText} primary={option.key} />
                    </MenuItem>
                );
            })}
        </Select>
    );
}

const renderRoleEditCell = (params) => {
    return <EditRole {...params} />;
}

export default renderRoleEditCell
