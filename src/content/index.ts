import { analyzeCandidate } from '@/common/openai';
import { loadSettings } from '@/common/storage';

import { extractCandidateInfo } from './domParser';
import { removeBadge, showErrorBadge, showLoadingBadge, showResultBadge } from './highlighter';
import './content.css';
import styles from './styles.css?inline';

let isAnalyzing = false;
let hasAnalyzed = false;
let stylesInjected = false;

function injectStyles(): void {
    if (stylesInjected) return;
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    stylesInjected = true;
}

async function runAnalysis(): Promise<void> {
    if (isAnalyzing) return;
    
    isAnalyzing = true;
    showLoadingBadge();
    
    try {
        const settings = await loadSettings();
        
        if (!settings.openaiApiKey || !settings.profileCriteria) {
            showErrorBadge('Please configure your API key and profile criteria in the extension popup.', () => {
                hasAnalyzed = false;
                runAnalysis();
            });
            isAnalyzing = false;
            return;
        }
        
        const candidateInfo = extractCandidateInfo();
        
        if (!candidateInfo || candidateInfo.length < 50) {
            showErrorBadge('Could not extract enough candidate information from this page.', () => {
                hasAnalyzed = false;
                runAnalysis();
            });
            isAnalyzing = false;
            return;
        }
        
        console.debug('[YC Founder Match] Analyzing candidate...');
        console.debug('[YC Founder Match] Extracted info length:', candidateInfo.length);
        
        const result = await analyzeCandidate(
            settings.openaiApiKey,
            settings.profileCriteria,
            candidateInfo
        );
        
        console.debug('[YC Founder Match] Analysis result:', result);
        
        showResultBadge(result, () => {
            hasAnalyzed = false;
            runAnalysis();
        });
        
        hasAnalyzed = true;
    } catch (error) {
        console.error('[YC Founder Match] Analysis error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        showErrorBadge(errorMessage, () => {
            hasAnalyzed = false;
            runAnalysis();
        });
    } finally {
        isAnalyzing = false;
    }
}

function init(): void {
    const url = window.location.href;
    const isCandidatePage = url.includes('startupschool.org/cofounder-matching/candidate/');
    
    if (!isCandidatePage) {
        console.debug('[YC Founder Match] Not a candidate page, skipping');
        return;
    }
    
    injectStyles();
    console.debug('[YC Founder Match] Candidate page detected, starting analysis...');
    
    setTimeout(() => {
        if (!hasAnalyzed) {
            runAnalysis();
        }
    }, 1500);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        hasAnalyzed = false;
        removeBadge();
        init();
    }
});

observer.observe(document.body, { childList: true, subtree: true });

export {};
