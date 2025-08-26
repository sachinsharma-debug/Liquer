
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Wine } from 'lucide-react';
import { BASE_URL } from '@/api/BaseUrl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import showToast from "@/components/reusableComponents/ToasterAlert";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    axios.post(BASE_URL + "login", {"email": email, "password": password}).then(
      (response) => {
        if (response.status === 200) {
          login("admin@wineshipping.com", "password123");
          showToast(response.data.message, "success");
          navigate('dashboard');
        }
      }
    ).catch(
      (error) => {
        showToast(error.response.data.message, "error");
      }
    );
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wine className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">WineShipping ERP</span>
          </div>
          <CardTitle>Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm">
            <p className="font-semibold">Demo Credentials:</p>
            <p>Email: admin@wineshipping.com</p>
            <p>Password: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
