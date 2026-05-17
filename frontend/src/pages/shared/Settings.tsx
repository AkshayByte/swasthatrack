import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useRoleHome } from '@/hooks/useRoleHome';
import {
    Palette,
    Globe,
    Bell,
    Shield,
    Database,
    ArrowLeft,
    Save,
    Moon,
    Sun
} from 'lucide-react';

export default function Settings() {
    const navigate = useNavigate();
    const roleHome = useRoleHome();
    const [settings, setSettings] = useState({
        theme: 'light',
        language: 'en',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: false,
        autoSave: true,
        dataBackup: true,
        twoFactorAuth: false
    });

    const handleSave = () => {
        // In real app, this would save to backend
        console.log('Settings saved:', settings);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your application preferences and configurations
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(roleHome)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="appearance" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                    <TabsTrigger value="appearance">
                        <Palette className="mr-2 h-4 w-4" />
                        Appearance
                    </TabsTrigger>
                    <TabsTrigger value="regional">
                        <Globe className="mr-2 h-4 w-4" />
                        Regional
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Shield className="mr-2 h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="data">
                        <Database className="mr-2 h-4 w-4" />
                        Data
                    </TabsTrigger>
                </TabsList>

                {/* Appearance Settings */}
                <TabsContent value="appearance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme Preferences</CardTitle>
                            <CardDescription>
                                Customize the look and feel of your dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="theme">Theme</Label>
                                <Select
                                    value={settings.theme}
                                    onValueChange={(value) => setSettings({ ...settings, theme: value })}
                                >
                                    <SelectTrigger id="theme">
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">
                                            <div className="flex items-center gap-2">
                                                <Sun className="h-4 w-4" />
                                                Light
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="dark">
                                            <div className="flex items-center gap-2">
                                                <Moon className="h-4 w-4" />
                                                Dark
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="system">System Default</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Display Options</h4>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Compact Mode</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Reduce spacing between elements
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Show Animations</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Enable smooth transitions and animations
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Regional Settings */}
                <TabsContent value="regional" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Regional Preferences</CardTitle>
                            <CardDescription>
                                Set your language, timezone, and format preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Select
                                    value={settings.language}
                                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                                >
                                    <SelectTrigger id="language">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                                        <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                                        <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select
                                    value={settings.timezone}
                                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                                >
                                    <SelectTrigger id="timezone">
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                                        <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateFormat">Date Format</Label>
                                    <Select
                                        value={settings.dateFormat}
                                        onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
                                    >
                                        <SelectTrigger id="dateFormat">
                                            <SelectValue placeholder="Select format" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timeFormat">Time Format</Label>
                                    <Select
                                        value={settings.timeFormat}
                                        onValueChange={(value) => setSettings({ ...settings, timeFormat: value })}
                                    >
                                        <SelectTrigger id="timeFormat">
                                            <SelectValue placeholder="Select format" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="12h">12-hour</SelectItem>
                                            <SelectItem value="24h">24-hour</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose how you want to receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive updates via email
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.emailNotifications}
                                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>SMS Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive updates via SMS
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.smsNotifications}
                                    onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive browser push notifications
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.pushNotifications}
                                    onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>
                                Manage your account security preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Add an extra layer of security to your account
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.twoFactorAuth}
                                    onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label>Session Timeout</Label>
                                <Select defaultValue="30">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select timeout" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15">15 minutes</SelectItem>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="60">1 hour</SelectItem>
                                        <SelectItem value="never">Never</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Button variant="outline" className="w-full">
                                    View Active Sessions
                                </Button>
                                <Button variant="destructive" className="w-full">
                                    Sign Out All Devices
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Data Settings */}
                <TabsContent value="data" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Management</CardTitle>
                            <CardDescription>
                                Control how your data is stored and managed
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Auto-Save</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically save your work
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.autoSave}
                                    onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Automatic Backups</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Regularly backup your data
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.dataBackup}
                                    onCheckedChange={(checked) => setSettings({ ...settings, dataBackup: checked })}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label>Data Export</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Download your data in various formats
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1">
                                        Export as CSV
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                        Export as JSON
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label className="text-destructive">Danger Zone</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Irreversible actions that affect your data
                                </p>
                                <Button variant="destructive" className="w-full">
                                    Clear All Cache
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
