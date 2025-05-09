import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = 'https://bd4vdphin1.execute-api.us-east-1.amazonaws.com/api';

interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    profilePic: string;
    address: string;
  };
  notificationPreferences: {
    emailNotifications: boolean;
    inAppNotifications: boolean;
  };
  dataPrivacy: {
    dataBackup: boolean;
    analytics: boolean;
  };
}

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      profilePic: '',
      address: ''
    },
    notificationPreferences: {
      emailNotifications: true,
      inAppNotifications: true
    },
    dataPrivacy: {
      dataBackup: true,
      analytics: true
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast.error('Failed to load settings');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings.profile),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings.notificationPreferences),
      });

      if (!response.ok) throw new Error('Failed to update notification preferences');
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/privacy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings.dataPrivacy),
      });

      if (!response.ok) throw new Error('Failed to update privacy settings');
      toast.success('Privacy settings updated');
    } catch (error) {
      toast.error('Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setLoading(true);
      
      // Convert image to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      // Update profile with new image
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...settings.profile,
          profilePic: base64String
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile picture');

      // Update local state
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          profilePic: base64String
        }
      }));

      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error('Failed to update profile picture');
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    const firstName = settings.profile.firstName || '';
    const lastName = settings.profile.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={settings.profile.profilePic} />
                    <AvatarFallback className="text-2xl bg-primary/10">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {loading ? 'Uploading...' : 'Change Photo'}
                  </Button>
                </div>
                
                {/* Right Column - Profile Form */}
                <div className="md:col-span-2">
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <Input
                          value={settings.profile.firstName}
                          onChange={(e) => setSettings({
                            ...settings,
                            profile: { ...settings.profile, firstName: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <Input
                          value={settings.profile.lastName}
                          onChange={(e) => setSettings({
                            ...settings,
                            profile: { ...settings.profile, lastName: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input value={user?.email || ''} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input 
                        value={settings.profile.phoneNumber}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, phoneNumber: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Address</label>
                      <Input 
                        value={settings.profile.address}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, address: e.target.value }
                        })}
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationUpdate} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                    <Switch
                      checked={settings.notificationPreferences.emailNotifications}
                      onCheckedChange={(checked) => {
                        setSettings({
                          ...settings,
                          notificationPreferences: {
                            ...settings.notificationPreferences,
                            emailNotifications: checked
                          }
                        });
                      }}
                    />
                  </div>
                <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">In-App Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
                  </div>
                    <Switch
                      checked={settings.notificationPreferences.inAppNotifications}
                      onCheckedChange={(checked) => {
                        setSettings({
                          ...settings,
                          notificationPreferences: {
                            ...settings.notificationPreferences,
                            inAppNotifications: checked
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Manage your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePrivacyUpdate} className="space-y-6">
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Data Backup</h3>
                      <p className="text-sm text-muted-foreground">Enable automatic data backup</p>
                </div>
                    <Switch
                      checked={settings.dataPrivacy.dataBackup}
                      onCheckedChange={(checked) => {
                        setSettings({
                          ...settings,
                          dataPrivacy: {
                            ...settings.dataPrivacy,
                            dataBackup: checked
                          }
                        });
                      }}
                    />
                  </div>
                <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Analytics</h3>
                      <p className="text-sm text-muted-foreground">Allow usage analytics collection</p>
                  </div>
                    <Switch
                      checked={settings.dataPrivacy.analytics}
                      onCheckedChange={(checked) => {
                        setSettings({
                          ...settings,
                          dataPrivacy: {
                            ...settings.dataPrivacy,
                            analytics: checked
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Privacy Settings'}
                  </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}