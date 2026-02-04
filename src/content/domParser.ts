export function extractCandidateInfo(): string {
    const mainContent = document.querySelector('main') || document.body;
    
    const elementsToExtract = mainContent.querySelectorAll(
        'h1, h2, h3, h4, p, li, span, div[class*="bio"], div[class*="about"], div[class*="description"], div[class*="profile"], section'
    );
    
    const textParts: string[] = [];
    const seenText = new Set<string>();
    
    elementsToExtract.forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length > 10 && text.length < 2000 && !seenText.has(text)) {
            const parentText = el.parentElement?.textContent?.trim();
            if (parentText !== text || el.tagName.match(/^H[1-6]$/)) {
                seenText.add(text);
                textParts.push(text);
            }
        }
    });
    
    const combinedText = textParts.join('\n\n');
    
    if (combinedText.length > 8000) {
        return combinedText.slice(0, 8000) + '...';
    }
    
    return combinedText;
}

export function getPageTitle(): string {
    const h1 = document.querySelector('h1');
    return h1?.textContent?.trim() || document.title;
}
