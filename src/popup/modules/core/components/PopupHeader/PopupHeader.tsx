import { ReactElement, ReactNode } from 'react';

import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import { Toolbar } from '@mui/material';

import classes from './PopupHeader.module.css';

export default function PopupHeader(props: { children?: ReactNode }): ReactElement {
    return (
        <Toolbar className={classes.PopupHeader} sx={{ boxShadow: 1 }}>
            <PeopleAltRoundedIcon className={classes.PopupLogo} />
            <h1>YC Founder Match</h1>
            {props.children}
        </Toolbar>
    );
}
