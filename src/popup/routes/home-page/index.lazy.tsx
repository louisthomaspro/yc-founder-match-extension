import { ReactElement, useCallback, useEffect, useState } from 'react';

import { useSnackbar } from 'notistack';

import {
    Alert,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { createLazyFileRoute } from '@tanstack/react-router';

import { loadSettings, saveSettings } from '@/common/storage';
import { UserSettings } from '@/common/types/settings';
import PopupContent from '@/popup/modules/core/components/PopupContent/PopupContent';
import PopupHeader from '@/popup/modules/core/components/PopupHeader/PopupHeader';

function HomePage(): ReactElement {
    const { enqueueSnackbar } = useSnackbar();

    const [apiKey, setApiKey] = useState<string>('');
    const [profileCriteria, setProfileCriteria] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        loadSettings().then(settings => {
            setApiKey(settings.openaiApiKey);
            setProfileCriteria(settings.profileCriteria);
            setLoading(false);
        });
    }, []);

    const handleSave = useCallback(async () => {
        setSaving(true);
        try {
            const settings: UserSettings = {
                openaiApiKey: apiKey.trim(),
                profileCriteria: profileCriteria.trim()
            };
            await saveSettings(settings);
            enqueueSnackbar('Settings saved successfully!', { variant: 'success' });
        } catch (e) {
            console.error(e);
            enqueueSnackbar('Failed to save settings', { variant: 'error' });
        } finally {
            setSaving(false);
        }
    }, [apiKey, profileCriteria, enqueueSnackbar]);

    if (loading) {
        return (
            <>
                <PopupHeader />
                <PopupContent>
                    <CircularProgress />
                </PopupContent>
            </>
        );
    }

    const isValid = apiKey.trim() && profileCriteria.trim();

    return (
        <>
            <PopupHeader />
            <PopupContent>
                <Stack spacing={2} sx={{ width: '100%', p: 2 }}>
                    <Alert severity="info" sx={{ fontSize: '12px' }}>
                        Configure your OpenAI API key and describe your ideal co-founder profile.
                        The extension will automatically analyze candidates on Startup School.
                    </Alert>

                    <TextField
                        label="OpenAI API Key"
                        type="password"
                        size="small"
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        fullWidth
                        helperText="Your API key is stored locally and never shared"
                    />

                    <TextField
                        label="Ideal Co-founder Profile"
                        multiline
                        rows={6}
                        size="small"
                        value={profileCriteria}
                        onChange={e => setProfileCriteria(e.target.value)}
                        placeholder={`Describe your ideal co-founder, for example:

- Technical background (software engineering, ML/AI preferred)
- 3+ years of experience in startups or tech
- Based in US or willing to relocate
- Interested in B2B SaaS or developer tools
- Full-time commitment available
- Red flags: only looking for idea validation, no coding skills`}
                        fullWidth
                    />

                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={!isValid || saving}
                        fullWidth
                    >
                        {saving ? <CircularProgress size={20} /> : 'Save Settings'}
                    </Button>

                    {isValid && (
                        <Typography variant="caption" color="text.secondary" textAlign="center">
                            Visit a candidate profile on Startup School to see the analysis
                        </Typography>
                    )}
                </Stack>
            </PopupContent>
        </>
    );
}

export const Route = createLazyFileRoute('/home-page/')({
    component: HomePage
});
