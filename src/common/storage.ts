import { DEFAULT_SETTINGS, UserSettings } from './types/settings';

const STORAGE_KEY = 'ycfm_settings';

export async function saveSettings(settings: UserSettings): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEY]: settings });
}

export async function loadSettings(): Promise<UserSettings> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY] ?? DEFAULT_SETTINGS;
}

export async function hasValidSettings(): Promise<boolean> {
    const settings = await loadSettings();
    return Boolean(settings.openaiApiKey && settings.profileCriteria);
}
