import { ReactElement, ReactNode } from 'react';

import { Github, Sparkles } from 'lucide-react';

import classes from './PopupHeader.module.css';

export default function PopupHeader(props: { children?: ReactNode }): ReactElement {
    return (
        <div className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1624] border-b border-[rgba(240,104,39,0.2)] overflow-hidden [&>button]:text-[#f4f4f5]">
            <div className="relative z-[2] flex items-center justify-between p-4 px-5 gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className={`${classes.LogoIcon} relative w-11 h-11 flex items-center justify-center bg-gradient-to-br from-[#f06827] to-[#ff8c42] shadow-[0_4px_12px_rgba(240,104,39,0.3)]`}>
                        <Sparkles className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" size={20} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h1 className={`${classes.Title} m-0 text-lg font-bold tracking-[-0.02em] leading-[1.2]`}>YC Founder Match</h1>
                        <span className="text-[11px] text-[rgba(240,104,39,0.9)] font-medium tracking-[0.02em] uppercase">Find your perfect co-founder</span>
                    </div>
                </div>
                <a
                    href="https://github.com/louisthomaspro/yc-founder-match-extension"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-[3] p-2 rounded-lg text-[rgba(240,104,39,0.8)] hover:text-[#f06827] hover:bg-[rgba(240,104,39,0.1)] transition-colors duration-300"
                    aria-label="View on GitHub"
                >
                    <Github size={20} />
                </a>
                {props.children}
            </div>
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-br from-[rgba(240,104,39,0.1)] via-transparent to-[rgba(240,104,39,0.05)] pointer-events-none z-[1]"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(240,104,39,0.5)] to-transparent"></div>
        </div>
    );
}
