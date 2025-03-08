import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useForm } from 'react-hook-form';
import { Award, Upload, X, Check } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import { TeacherCredentials } from '../../types';

interface CredentialsFormData {
  institution: string;
  degree: string;
  graduationYear: string;
  specialization: string;
  experience: number;
}

const TeacherCredentialsForm: React.FC = () => {
  const { user, submitTeacherCredentials, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<CredentialsFormData>();
  
  const [documents, setDocuments] = useState<string[]>([]);
  const [documentUrl, setDocumentUrl] = useState('');
  
  const handleAddDocument = () => {
    if (documentUrl.trim() && !documents.includes(documentUrl)) {
      setDocuments([...documents, documentUrl]);
      setDocumentUrl('');
    }
  };
  
  const handleRemoveDocument = (url: string) => {
    setDocuments(documents.filter(doc => doc !== url));
  };
  
  const onSubmit = async (data: CredentialsFormData) => {
    if (!user) return;
    
    const credentials: TeacherCredentials = {
      ...data,
      documentUrls: documents,
      validationStatus: 'pending'
    };
    
    try {
      await submitTeacherCredentials(user.id, credentials);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to submit teacher credentials.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
          <Award className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Become a Validated Teacher</h1>
        <p className="mt-2 text-lg text-gray-600">
          Submit your credentials to get validated as a teacher on our platform
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Teacher Credentials</h2>
          <p className="text-gray-600 mt-1">
            Please provide accurate information about your educational background and teaching experience
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Institution/University"
                fullWidth
                error={errors.institution?.message}
                {...register('institution', { 
                  required: 'Institution is required'
                })}
              />
            </div>
            
            <div>
              <Input
                label="Degree"
                fullWidth
                error={errors.degree?.message}
                {...register('degree', { 
                  required: 'Degree is required'
                })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Graduation Year"
                  type="number"
                  fullWidth
                  error={errors.graduationYear?.message}
                  {...register('graduationYear', { 
                    required: 'Graduation year is required',
                    min: {
                      value: 1950,
                      message: 'Invalid graduation year'
                    },
                    max: {
                      value: new Date().getFullYear(),
                      message: 'Year cannot be in the future'
                    }
                  })}
                />
              </div>
              
              <div>
                <Input
                  label="Years of Teaching Experience"
                  type="number"
                  fullWidth
                  error={errors.experience?.message}
                  {...register('experience', { 
                    required: 'Experience is required',
                    min: {
                      value: 0,
                      message: 'Experience cannot be negative'
                    }
                  })}
                />
              </div>
            </div>
            
            <div>
              <Input
                label="Specialization"
                fullWidth
                error={errors.specialization?.message}
                {...register('specialization', { 
                  required: 'Specialization is required'
                })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Documents
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Add URLs to your certificates, degrees, or other supporting documents
              </p>
              
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="https://example.com/document.pdf"
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  fullWidth
                />
                <Button 
                  type="button" 
                  onClick={handleAddDocument}
                  disabled={!documentUrl.trim()}
                >
                  Add
                </Button>
              </div>
              
              {documents.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                      <a 
                        href={doc} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm truncate max-w-md"
                      >
                        {doc}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(doc)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No documents added yet</p>
              )}
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                fullWidth 
                size="lg"
                isLoading={isLoading}
              >
                Submit for Validation
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p className="font-medium mb-1">What happens next?</p>
            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li>Our team will review your credentials</li>
              <li>You'll receive a notification when your status is updated</li>
              <li>Once validated, you can upload demo videos and create courses</li>
            </ol>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TeacherCredentialsForm;