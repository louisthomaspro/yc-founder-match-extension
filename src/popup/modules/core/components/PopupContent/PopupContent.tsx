import { ReactElement, ReactNode } from 'react';

import Box from '@mui/material/Box';

export default function PopupContent(props: { children?: ReactNode }): ReactElement {
    return (
        <Box
            className="min-h-[400px] w-full m-0 text-left"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="stretch"
            sx={{
                background: 'linear-gradient(180deg, transparent 0%, hsl(222, 47%, 11%) 100%)',
            }}
        >
            {props.children}
        </Box>
    );
}
