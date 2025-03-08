import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
          <p className="mt-2 text-gray-600">Join our learning community</p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Input
                    label="Full Name"
                    type="text"
                    fullWidth
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                    error={errors.name?.message}
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                </div>
                
                <div>
                  <Input
                    label="Email"
                    type="email"
                    fullWidth
                    leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                    error={errors.email?.message}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>
                
                <div>
                  <Input
                    label="Password"
                    type="password"
                    fullWidth
                    leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                    error={errors.password?.message}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                </div>
                
                <div>
                  <Input
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === watch('password') || 'Passwords do not match'
                    })}
                  />
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    fullWidth 
                    size="lg"
                    isLoading={isLoading}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="p-6 bg-gray-50 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;