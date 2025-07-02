import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/avatar';
import { Button } from '@/Components/button';
import { Input } from '@/Components/input';
import { Label } from '@/Components/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/card';
import { Badge } from '@/Components/badge';
import { Separator } from '@/Components/separator';
import { Mail, User, Lock, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  name: string;
  email: string;
  username: string;
  avatar: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    }, 1000);
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    }, 1000);
  };

  return (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-black shadow-xl">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-2xl font-semibold text-white">Profile Settings</DialogTitle>
        <DialogDescription className="text-gray-400">
          Manage your account settings and preferences
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 p-6 border border-zinc-900 bg-black rounded-xl shadow-lg">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-4 ring-gray-800 shadow-md">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">{user.name}</h3>
            <p className="text-gray-400 flex items-center mt-1">
              <Mail className="h-4 w-4 mr-2" />
              {user.email}
            </p>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="bg-green-700 text-green-100">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Active
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 border border-zinc-900 bg-black text-white">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700">Profile Info</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gray-700">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-6">
            <Card className="border border-zinc-900 bg-black shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">Personal Information</CardTitle>
                    <CardDescription className="text-gray-400">Update your personal details here</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing ? "text-gray-300" : ""}
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-300">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className={`bg-gray-700 text-white ${!isEditing ? "opacity-70" : ""}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-300">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      disabled={!isEditing}
                      className={`bg-gray-700 text-white ${!isEditing ? "opacity-70" : ""}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-gray-700 text-white opacity-70"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed from this interface</p>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-6">
            <Card className="border border-zinc-900 bg-black shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <Lock className="h-5 w-5 mr-2" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-gray-400">Ensure your account stays secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-300">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <Separator className="bg-gray-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-300">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className="bg-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="bg-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 shadow-inner">
                  <h4 className="text-sm font-medium text-gray-100 mb-2">Password Requirements:</h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                    <li>• Include at least one special character</li>
                  </ul>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleChangePassword} className="bg-green-600 hover:bg-green-700">
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  </Dialog>
);

};

export default UserProfileModal;