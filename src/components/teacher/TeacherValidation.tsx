import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Award, CheckCircle, XCircle, User, Calendar, BookOpen, FileText } from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';

const TeacherValidation: React.FC = () => {
  const { user, validateTeacher, isLoading } = useAuthStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Mock pending teacher validations
  const [pendingValidations, setPendingValidations] = useState([
    {
      id: 'user2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      credentials: {
        institution: 'Stanford University',
        degree: 'Ph.D. in Computer Science',
        graduationYear: '2018',
        specialization: 'Artificial Intelligence',
        experience: 5,
        documentUrls: [
          'https://example.com/jane-phd-certificate.pdf',
          'https://example.com/jane-teaching-experience.pdf'
        ],
        validationStatus: 'pending',
        submittedAt: '2023-05-15'
      }
    },
    {
      id: 'user3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      credentials: {
        institution: 'MIT',
        degree: 'Master of Science in Electrical Engineering',
        graduationYear: '2015',
        specialization: 'Computer Architecture',
        experience: 7,
        documentUrls: [
          'https://example.com/robert-ms-certificate.pdf',
          'https://example.com/robert-teaching-portfolio.pdf'
        ],
        validationStatus: 'pending',
        submittedAt: '2023-05-20'
      }
    }
  ]);
  
  const handleApprove = async () => {
    if (!selectedUserId) return;
    
    try {
      await validateTeacher(selectedUserId, true);
      setPendingValidations(prev => prev.filter(user => user.id !== selectedUserId));
      setSelectedUserId(null);
    } catch (error) {
      console.error('Failed to approve teacher:', error);
    }
  };
  
  const handleReject = async () => {
    if (!selectedUserId) return;
    
    try {
      await validateTeacher(selectedUserId, false);
      setPendingValidations(prev => prev.filter(user => user.id !== selectedUserId));
      setSelectedUserId(null);
    } catch (error) {
      console.error('Failed to reject teacher:', error);
    }
  };
  
  const selectedUser = pendingValidations.find(user => user.id === selectedUserId);
  
  if (!user?.isValidatedTeacher) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            Only validated teachers can access the teacher validation page.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Validation</h1>
          <p className="text-lg text-gray-600 mt-2">
            Review and validate teacher credentials
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <p className="text-blue-700 text-sm font-medium">
            {pendingValidations.length} pending validation{pendingValidations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Pending Validations</h2>
            </CardHeader>
            
            <CardContent className="p-0">
              {pendingValidations.length === 0 ? (
                <div className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500">No pending validations</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {pendingValidations.map(teacher => (
                    <li key={teacher.id}>
                      <button
                        className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors ${
                          selectedUserId === teacher.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedUserId(teacher.id)}
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                            {teacher.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                            <p className="text-xs text-gray-500">{teacher.email}</p>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedUser ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Teacher Credentials</h2>
                  <Badge variant="warning">Pending Review</Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-xl">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{selectedUser.name}</h3>
                    <p className="text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-700 mb-2">
                      <BookOpen className="h-5 w-5 mr-2" />
                      <span className="font-medium">Education</span>
                    </div>
                    <p className="text-gray-900 font-medium">{selectedUser.credentials.institution}</p>
                    <p className="text-gray-700">{selectedUser.credentials.degree}</p>
                    <p className="text-gray-500 text-sm">Graduated: {selectedUser.credentials.graduationYear}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-700 mb-2">
                      <User className="h-5 w-5 mr-2" />
                      <span className="font-medium">Specialization</span>
                    </div>
                    <p className="text-gray-900">{selectedUser.credentials.specialization}</p>
                    <p className="text-gray-700">{selectedUser.credentials.experience} years of teaching experience</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Supporting Documents
                  </h4>
                  
                  <div className="space-y-2">
                    {selectedUser.credentials.documentUrls.map((doc, index) => (
                      <a 
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white border border-gray-200 rounded p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600">Document {index + 1}</span>
                          <span className="text-xs text-gray-500">View Document</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Submitted on {selectedUser.credentials.submittedAt}</span>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleReject}
                  isLoading={isLoading}
                  leftIcon={<XCircle className="h-4 w-4" />}
                  className="w-full sm:w-auto"
                >
                  Reject
                </Button>
                <Button 
                  onClick={handleApprove}
                  isLoading={isLoading}
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                  className="w-full sm:w-auto sm:ml-auto"
                >
                  Approve as Teacher
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Select a teacher to review their credentials</p>
                <p className="text-gray-400 text-sm">
                  You can approve or reject teacher validation requests
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherValidation;