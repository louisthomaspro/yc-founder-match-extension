import { AnalysisResult, Flag } from '@/common/types/settings';

let scoreBadge: HTMLDivElement | null = null;

export function showLoadingBadge(): void {
    removeBadge();
    
    scoreBadge = document.createElement('div');
    scoreBadge.className = 'fixed top-20 right-5 z-[10000] px-6 py-4 rounded-xl font-sans text-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)] max-w-[320px] bg-[#2d2d44] text-[#eee] border border-[#333]';
    scoreBadge.innerHTML = `
        <button class="absolute top-2 right-2 bg-transparent border-0 text-[#666] cursor-pointer text-lg leading-none p-1 transition-colors duration-200 hover:text-white" title="Close">&times;</button>
        <div class="flex items-center gap-3 mb-3">
            <div class="ycfm-loading-spinner"></div>
            <div>
                <div class="font-semibold">Analyzing candidate...</div>
                <div class="text-xs text-[#888] uppercase tracking-[0.5px]">YC Founder Match</div>
            </div>
        </div>
    `;
    
    scoreBadge.querySelector('button[title="Close"]')?.addEventListener('click', removeBadge);
    document.body.appendChild(scoreBadge);
}

export function showErrorBadge(error: string, onRetry?: () => void): void {
    removeBadge();
    
    scoreBadge = document.createElement('div');
    scoreBadge.className = 'fixed top-20 right-5 z-[10000] px-6 py-4 rounded-xl font-sans text-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)] max-w-[320px] bg-[#3d1f1f] text-[#eee] border border-[#8b3a3a]';
    scoreBadge.innerHTML = `
        <button class="absolute top-2 right-2 bg-transparent border-0 text-[#666] cursor-pointer text-lg leading-none p-1 transition-colors duration-200 hover:text-white" title="Close">&times;</button>
        <div class="font-semibold mb-2">Analysis Failed</div>
        <div class="text-xs text-[#f87171]">${escapeHtml(error)}</div>
        <button class="mt-3 bg-[#333] border border-[#444] text-[#ccc] px-4 py-2 rounded-md cursor-pointer text-xs w-full transition-all duration-200 hover:bg-[#444] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">Try Again</button>
    `;
    
    const closeBtn = scoreBadge.querySelector('button[title="Close"]');
    closeBtn?.addEventListener('click', removeBadge);
    const tryAgainBtn = scoreBadge.querySelector('button:last-child') as HTMLButtonElement;
    if (tryAgainBtn && onRetry) {
        tryAgainBtn.addEventListener('click', () => {
            onRetry();
        });
    }
    document.body.appendChild(scoreBadge);
}

export function showResultBadge(result: AnalysisResult, onReanalyze: () => void): void {
    removeBadge();
    
    const scoreColor = result.score >= 70 ? 'text-[#4ade80]' : result.score >= 40 ? 'text-[#fbbf24]' : 'text-[#f87171]';
    
    scoreBadge = document.createElement('div');
    scoreBadge.className = 'fixed top-20 right-5 z-[10000] px-6 py-4 rounded-xl font-sans text-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)] max-w-[320px] bg-[#1a1a2e] text-[#eee] border border-[#333]';
    scoreBadge.innerHTML = `
        <button class="absolute top-2 right-2 bg-transparent border-0 text-[#666] cursor-pointer text-lg leading-none p-1 transition-colors duration-200 hover:text-white" title="Close">&times;</button>
        <div class="flex items-center gap-3 mb-3">
            <div class="text-[32px] font-bold leading-none ${scoreColor}">${result.score}</div>
            <div>
                <div class="font-semibold">Match Score</div>
                <div class="text-xs text-[#888] uppercase tracking-[0.5px]">YC Founder Match</div>
            </div>
        </div>
        <div class="text-xs text-[#aaa] mb-2">${escapeHtml(result.summary)}</div>
        ${renderFlags(result.greenFlags, 'green', 'Green Flags')}
        ${renderFlags(result.redFlags, 'red', 'Red Flags')}
        <button class="mt-3 bg-[#333] border border-[#444] text-[#ccc] px-4 py-2 rounded-md cursor-pointer text-xs w-full transition-all duration-200 hover:bg-[#444] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">Re-analyze</button>
    `;
    
    const closeBtn = scoreBadge.querySelector('button[title="Close"]');
    closeBtn?.addEventListener('click', removeBadge);
    const reanalyzeBtn = scoreBadge.querySelector('button:last-child') as HTMLButtonElement;
    if (reanalyzeBtn) {
        reanalyzeBtn.addEventListener('click', () => {
            onReanalyze();
        });
    }
    
    document.body.appendChild(scoreBadge);
    
    highlightTextInPage(result.greenFlags, 'green');
    highlightTextInPage(result.redFlags, 'red');
}

function renderFlags(flags: Flag[], type: 'green' | 'red', title: string): string {
    if (!flags || flags.length === 0) return '';
    
    const titleColor = type === 'green' ? 'text-[#4ade80]' : 'text-[#f87171]';
    
    return `
        <div class="mt-3 pt-3 border-t border-[#333]">
            <div class="text-[11px] font-semibold uppercase tracking-[0.5px] mb-2 ${titleColor}">${title}</div>
            ${flags.map(flag => `
                <div class="ycfm-flag-item ${type} text-xs mb-1 pl-3 relative text-[#ccc]" title="${escapeHtml(flag.reason)}">
                    ${escapeHtml(truncate(flag.text, 60))}
                </div>
            `).join('')}
        </div>
    `;
}

function highlightTextInPage(flags: Flag[], type: 'green' | 'red'): void {
    if (!flags || flags.length === 0) return;
    
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                const badge = node.parentElement?.closest('[class*="fixed"][class*="top-20"]');
                if (badge) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    
    const textNodes: Text[] = [];
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode as Text);
    }
    
    flags.forEach(flag => {
        const searchText = flag.text.toLowerCase();
        const words = searchText.split(/\s+/).filter(w => w.length > 4);
        
        if (words.length < 2) return;
        
        const searchPattern = words.slice(0, 3).join('.*');
        const regex = new RegExp(searchPattern, 'i');
        
        for (const textNode of textNodes) {
            const nodeText = textNode.textContent || '';
            if (regex.test(nodeText)) {
                const parent = textNode.parentElement;
                if (parent && !parent.classList.contains(`ycfm-highlight-${type}`)) {
                    parent.classList.add(`ycfm-highlight-${type}`);
                    parent.title = flag.reason;
                    break;
                }
            }
        }
    });
}

export function removeBadge(): void {
    if (scoreBadge) {
        scoreBadge.remove();
        scoreBadge = null;
    }
    
    document.querySelectorAll('.ycfm-highlight-green, .ycfm-highlight-red').forEach(el => {
        el.classList.remove('ycfm-highlight-green', 'ycfm-highlight-red');
        el.removeAttribute('title');
    });
}

export function setReanalyzeHandler(handler: () => void): void {
    const btn = scoreBadge?.querySelector('.ycfm-reanalyze-btn');
    if (btn) {
        btn.addEventListener('click', handler);
    }
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}
