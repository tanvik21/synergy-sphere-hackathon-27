import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import heroIllustration from '@/assets/hero-illustration.jpg';

export default function Login() {
  const { login, isAuthenticated } = useAppStore();
  const [email, setEmail] = useState('sarah@synergysphere.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = login(email, password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background illustration */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroIllustration} 
          alt="Team collaboration" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-primary font-bold text-lg">SS</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SynergySphere</h1>
          <p className="text-white/80">Welcome back to your workspace</p>
        </div>

        {/* Login Form */}
        <Card className="card-glass border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-border/50 focus:bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 border-border/50 focus:bg-background"
                />
              </div>

              <Button
                type="submit"
                className="w-full btn-hero"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Demo credentials:</p>
              <div className="text-xs space-y-1">
                <p><strong>Email:</strong> sarah@synergysphere.com</p>
                <p><strong>Password:</strong> password</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}