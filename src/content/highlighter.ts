import { AnalysisResult, Flag } from '@/common/types/settings';

let scoreBadge: HTMLDivElement | null = null;

export function showLoadingBadge(): void {
    removeBadge();
    
    scoreBadge = document.createElement('div');
    scoreBadge.className = 'ycfm-score-badge loading';
    scoreBadge.innerHTML = `
        <button class="ycfm-close-btn" title="Close">&times;</button>
        <div class="ycfm-score-header">
            <div class="ycfm-loading-spinner"></div>
            <div>
                <div style="font-weight: 600;">Analyzing candidate...</div>
                <div class="ycfm-score-label">YC Founder Match</div>
            </div>
        </div>
    `;
    
    scoreBadge.querySelector('.ycfm-close-btn')?.addEventListener('click', removeBadge);
    document.body.appendChild(scoreBadge);
}

export function showErrorBadge(error: string): void {
    removeBadge();
    
    scoreBadge = document.createElement('div');
    scoreBadge.className = 'ycfm-score-badge error';
    scoreBadge.innerHTML = `
        <button class="ycfm-close-btn" title="Close">&times;</button>
        <div style="font-weight: 600; margin-bottom: 8px;">Analysis Failed</div>
        <div style="font-size: 12px; color: #f87171;">${escapeHtml(error)}</div>
        <button class="ycfm-reanalyze-btn">Try Again</button>
    `;
    
    scoreBadge.querySelector('.ycfm-close-btn')?.addEventListener('click', removeBadge);
    document.body.appendChild(scoreBadge);
}

export function showResultBadge(result: AnalysisResult, onReanalyze: () => void): void {
    removeBadge();
    
    const scoreClass = result.score >= 70 ? 'high' : result.score >= 40 ? 'medium' : 'low';
    
    scoreBadge = document.createElement('div');
    scoreBadge.className = 'ycfm-score-badge';
    scoreBadge.innerHTML = `
        <button class="ycfm-close-btn" title="Close">&times;</button>
        <div class="ycfm-score-header">
            <div class="ycfm-score-value ${scoreClass}">${result.score}</div>
            <div>
                <div style="font-weight: 600;">Match Score</div>
                <div class="ycfm-score-label">YC Founder Match</div>
            </div>
        </div>
        <div style="font-size: 12px; color: #aaa; margin-bottom: 8px;">${escapeHtml(result.summary)}</div>
        ${renderFlags(result.greenFlags, 'green', 'Green Flags')}
        ${renderFlags(result.redFlags, 'red', 'Red Flags')}
        <button class="ycfm-reanalyze-btn">Re-analyze</button>
    `;
    
    scoreBadge.querySelector('.ycfm-close-btn')?.addEventListener('click', removeBadge);
    scoreBadge.querySelector('.ycfm-reanalyze-btn')?.addEventListener('click', () => {
        onReanalyze();
    });
    
    document.body.appendChild(scoreBadge);
    
    highlightTextInPage(result.greenFlags, 'green');
    highlightTextInPage(result.redFlags, 'red');
}

function renderFlags(flags: Flag[], type: 'green' | 'red', title: string): string {
    if (!flags || flags.length === 0) return '';
    
    return `
        <div class="ycfm-flags-section">
            <div class="ycfm-flags-title ${type}">${title}</div>
            ${flags.map(flag => `
                <div class="ycfm-flag-item ${type}" title="${escapeHtml(flag.reason)}">
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
                if (node.parentElement?.closest('.ycfm-score-badge')) {
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
