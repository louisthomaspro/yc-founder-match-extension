import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

import { AnalysisResult } from './types/settings';

export async function analyzeCandidate(
    apiKey: string,
    profileCriteria: string,
    candidateInfo: string
): Promise<AnalysisResult> {
    const openai = createOpenAI({
        apiKey,
        compatibility: 'strict'
    });

    const prompt = `You are an expert at matching co-founders for startups. Analyze the following candidate profile against the user's criteria and provide a detailed assessment.

USER'S IDEAL CO-FOUNDER CRITERIA:
${profileCriteria}

CANDIDATE PROFILE:
${candidateInfo}

Analyze how well this candidate matches the criteria. Return a JSON object with the following structure:
{
    "score": <number from 0-100 representing overall match percentage>,
    "greenFlags": [
        {"text": "<exact text from candidate profile that is a positive match>", "reason": "<why this is a good sign>"}
    ],
    "redFlags": [
        {"text": "<exact text from candidate profile that is concerning>", "reason": "<why this might be an issue>"}
    ],
    "summary": "<2-3 sentence summary of the match>"
}

Important:
- The "text" field in flags should contain the EXACT text snippet from the candidate profile (or very close paraphrase if exact match not possible)
- Be specific and actionable in your reasons
- Score should reflect realistic compatibility
- Include at least 2-3 green flags and red flags if they exist
- If the candidate is a strong match, score should be 70+
- If the candidate is a poor match, score should be below 40

Return ONLY the JSON object, no additional text.`;

    const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        prompt,
        temperature: 0.3
    });

    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanedText) as AnalysisResult;

    return result;
}
