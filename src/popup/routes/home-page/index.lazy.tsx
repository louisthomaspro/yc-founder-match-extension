import { ReactElement, useCallback, useEffect, useState } from 'react';

import { createLazyFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

import { loadSettings, saveSettings } from '@/common/storage';
import { UserSettings } from '@/common/types/settings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PopupContent from '@/popup/modules/core/components/PopupContent/PopupContent';
import PopupHeader from '@/popup/modules/core/components/PopupHeader/PopupHeader';

function HomePage(): ReactElement {
    const [apiKey, setApiKey] = useState<string>('');
    const [profileCriteria, setProfileCriteria] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        loadSettings().then(settings => {
            setApiKey(settings.openaiApiKey);
            setProfileCriteria(settings.profileCriteria);
            setLoading(false);
        });
    }, []);

    const handleSave = useCallback(async () => {
        setSaving(true);
        setSaveStatus(null);
        try {
            const settings: UserSettings = {
                openaiApiKey: apiKey.trim(),
                profileCriteria: profileCriteria.trim()
            };
            await saveSettings(settings);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (e) {
            console.error(e);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        } finally {
            setSaving(false);
        }
    }, [apiKey, profileCriteria]);

    if (loading) {
        return (
            <>
                <PopupHeader />
                <PopupContent>
                    <div className="flex items-center justify-center h-full animate-[fadeIn_0.4s_ease-out]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                                <Loader2 className="h-8 w-8 animate-spin text-[#f06827]" />
                                <div className="absolute inset-0 h-8 w-8 animate-ping opacity-20">
                                    <Loader2 className="h-8 w-8 text-[#f06827]" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">Loading settings...</p>
                        </div>
                    </div>
                </PopupContent>
            </>
        );
    }

    const isValid = apiKey.trim() && profileCriteria.trim();

    return (
        <>
            <PopupHeader />
            <PopupContent>
                <div className="flex flex-col gap-5 w-full p-5">
                    <Alert className="animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
                        <AlertDescription className="text-xs leading-relaxed">
                            Configure your OpenAI API key and describe your ideal co-founder profile.
                            The extension will automatically analyze candidates on{' '}
                            <a
                                href="https://www.startupschool.org/cofounder-matching/candidate/next"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#f06827] hover:text-[#ff8c42] hover:underline transition-colors duration-200 font-medium"
                            >
                                Startup School
                            </a>
                            .
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2.5 animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
                        <Label htmlFor="api-key" className="text-sm font-medium">OpenAI API Key</Label>
                        <Input
                            id="api-key"
                            type="password"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            placeholder="sk-..."
                        />
                        <p className="text-xs text-muted-foreground pl-1">
                            Your API key is stored locally and never shared
                        </p>
                    </div>

                    <div className="space-y-2.5 animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
                        <Label htmlFor="profile-criteria" className="text-sm font-medium">Ideal Co-founder Profile</Label>
                        <Textarea
                            id="profile-criteria"
                            rows={6}
                            value={profileCriteria}
                            onChange={e => setProfileCriteria(e.target.value)}
                            placeholder={`Describe your ideal co-founder, for example:

- Technical background (software engineering, ML/AI preferred)
- 3+ years of experience in startups or tech
- Based in US or willing to relocate
- Interested in B2B SaaS or developer tools
- Full-time commitment available
- Red flags: only looking for idea validation, no coding skills`}
                        />
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={!isValid || saving}
                        className="w-full mt-2 animate-[fadeInUp_0.5s_ease-out_0.4s_both]"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : saveStatus === 'success' ? (
                            'Saved!'
                        ) : saveStatus === 'error' ? (
                            'Failed to save'
                        ) : (
                            'Save Settings'
                        )}
                    </Button>

                    <div className="pt-3 border-t border-border/50 animate-[fadeInUp_0.5s_ease-out_0.5s_both]">
                        <p className="text-xs text-center text-muted-foreground">
                            Open source on{' '}
                            <a
                                href="https://github.com/louisthomaspro/yc-founder-match-extension"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#f06827] hover:text-[#ff8c42] hover:underline transition-colors duration-200 font-medium"
                            >
                                GitHub
                            </a>
                        </p>
                    </div>
                </div>
            </PopupContent>
        </>
    );
}

export const Route = createLazyFileRoute('/home-page/')({
    component: HomePage
});
