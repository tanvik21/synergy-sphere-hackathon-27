import { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';

export default function Profile() {
  const { user } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      setLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card className="card-elegant">
          <CardHeader className="text-center pb-6">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={formData.avatar} alt={formData.name} />
                <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardTitle className="mt-4">{user.name}</CardTitle>
            <CardDescription>{user.role}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className={isEditing ? '' : 'bg-muted/50'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className={isEditing ? '' : 'bg-muted/50'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? '' : 'bg-muted/50'}
                />
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn-hero"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="btn-hero"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Your contribution to projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Tasks Assigned</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-success">8</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-warning">2</div>
                <div className="text-sm text-muted-foreground">Projects Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}