import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, RefreshCw, Mail, Bell, Shield, Smartphone, Globe, Database, UserPlus, FileDown } from "lucide-react";
import * as settingsService from '@/services/settingsService';
import { useUser } from "@/contexts/UserContext";

const Settings = () => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settings, setSettings] = useState({
    notifications: {
      email: {
        reminders: true,
        birthdays: true,
        weeklySummary: true
      },
      push: {
        enabled: true,
        reminders: true,
        birthdays: true
      }
    },
    privacy: {
      dataEncryption: true,
      profileVisibility: 'private',
      contactSharing: false
    },
    appearance: {
      theme: 'system',
      language: 'en'
    }
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsService.getUserSettings();
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || ''
        });
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch (error) {
        toast.error('Error loading settings');
      }
    };

    loadSettings();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsService.updateProfile(formData);
      toast.success("Profile settings saved successfully");
    } catch (error) {
      toast.error("Error saving profile settings");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await settingsService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Password updated successfully");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error("Error updating password");
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await settingsService.updateNotifications(settings.notifications);
      toast.success("Notification preferences updated");
    } catch (error) {
      toast.error("Error updating notification preferences");
    }
  };

  const handleSavePrivacy = async () => {
    try {
      await settingsService.updatePrivacy(settings.privacy);
      toast.success("Privacy settings updated");
    } catch (error) {
      toast.error("Error updating privacy settings");
    }
  };

  const handleSaveAppearance = async () => {
    try {
      await settingsService.updateAppearance(settings.appearance);
      toast.success("Appearance settings updated");
    } catch (error) {
      toast.error("Error updating appearance settings");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await settingsService.deleteAccount();
        window.location.href = '/login';
      } catch (error) {
        toast.error("Error deleting account");
      }
    }
  };

  const handleExportData = () => {
    toast.success("Data export initiated. You'll receive an email with your data shortly.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" defaultValue={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
                </div>
                
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                </div>
              </div>
              
              <Button className="w-full sm:w-auto" onClick={handleUpdatePassword}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Control which email notifications you receive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-reminders">Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email reminders for follow-ups
                    </p>
                  </div>
                  <Switch 
                    id="email-reminders"
                    checked={settings.notifications.email.reminders}
                    onCheckedChange={(value) => setSettings({ ...settings, notifications: { ...settings.notifications, email: { ...settings.notifications.email, reminders: value } } })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-birthdays">Birthdays & Special Dates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about upcoming birthdays and special dates
                    </p>
                  </div>
                  <Switch 
                    id="email-birthdays"
                    checked={settings.notifications.email.birthdays}
                    onCheckedChange={(value) => setSettings({ ...settings, notifications: { ...settings.notifications, email: { ...settings.notifications.email, birthdays: value } } })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-digest">Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary of your network activity
                    </p>
                  </div>
                  <Switch 
                    id="email-digest"
                    checked={settings.notifications.email.weeklySummary}
                    onCheckedChange={(value) => setSettings({ ...settings, notifications: { ...settings.notifications, email: { ...settings.notifications.email, weeklySummary: value } } })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Configure in-app and mobile notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-all">Enable Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your devices
                    </p>
                  </div>
                  <Switch 
                    id="push-all"
                    checked={settings.notifications.push.enabled}
                    onCheckedChange={(value) => setSettings({ ...settings, notifications: { ...settings.notifications, push: { ...settings.notifications.push, enabled: value } } })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-reminders">Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about upcoming follow-ups
                    </p>
                  </div>
                  <Switch 
                    id="push-reminders"
                    checked={settings.notifications.push.reminders}
                    onCheckedChange={(value) => setSettings({ ...settings, notifications: { ...settings.notifications, push: { ...settings.notifications.push, reminders: value } } })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-insights">Insights & Suggestions</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive network insights and connection suggestions
                    </p>
                  </div>
                  <Switch id="push-insights" />
                </div>
              </div>
              
              <Button className="mt-6" onClick={handleSaveNotifications}>
                <Bell className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Privacy</CardTitle>
              <CardDescription>
                Control how your data is stored and used.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-encryption">Enhanced Data Encryption</Label>
                    <p className="text-sm text-muted-foreground">
                      Store your contacts with additional encryption
                    </p>
                  </div>
                  <Switch 
                    id="data-encryption"
                    checked={settings.privacy.dataEncryption}
                    onCheckedChange={(value) => setSettings({ ...settings, privacy: { ...settings.privacy, dataEncryption: value } })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve the app by sharing anonymous usage data
                    </p>
                  </div>
                  <Switch id="analytics" />
                </div>
              </div>
              
              <Button className="mt-6" onClick={handleSavePrivacy}>
                <Shield className="mr-2 h-4 w-4" />
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>
                Customize how the application looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.appearance.theme} onValueChange={(value) => setSettings({ ...settings, appearance: { ...settings.appearance, theme: value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-view">Default Contact View</Label>
                  <Select defaultValue="grid">
                    <SelectTrigger>
                      <SelectValue placeholder="Select default view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button className="mt-6" onClick={handleSaveAppearance}>
                <Globe className="mr-2 h-4 w-4" />
                Save Appearance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import & Export</CardTitle>
              <CardDescription>
                Manage your contact data import and export.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Import Contacts</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button variant="outline">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Import from CSV
                    </Button>
                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Import from Google
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium">Export Data</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button variant="outline" onClick={handleExportData}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Export All Data
                    </Button>
                    <Button variant="outline">
                      <Database className="mr-2 h-4 w-4" />
                      Export Contacts Only
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Actions here cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="destructive" onClick={handleDeleteAccount}>Delete All Contacts</Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
