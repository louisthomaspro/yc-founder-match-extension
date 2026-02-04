import { ReactElement, ReactNode } from 'react';

export default function PopupContent(props: { children?: ReactNode }): ReactElement {
    return (
        <div
            className="min-h-[400px] w-full m-0 text-left flex flex-col justify-start items-stretch"
            style={{
                background: 'linear-gradient(180deg, transparent 0%, hsl(222, 47%, 11%) 100%)',
            }}
        >
            {props.children}
        </div>
    );
}
