export interface UserSettings {
    openaiApiKey: string;
    profileCriteria: string;
}

export interface AnalysisResult {
    score: number;
    greenFlags: Flag[];
    redFlags: Flag[];
    summary: string;
}

export interface Flag {
    text: string;
    reason: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
    openaiApiKey: '',
    profileCriteria: ''
};
