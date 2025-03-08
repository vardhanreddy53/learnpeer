import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTestStore } from '../store/testStore';
import { useAuthStore } from '../store/authStore';
import { useSubjectStore } from '../store/subjectStore';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Award, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import Badge from '../components/ui/Badge';

const CertificationPage: React.FC = () => {
  const { userTestResults, isLoading: testLoading, error: testError, fetchUserTestResults } = useTestStore();
  const { user, isAuthenticated } = useAuthStore();
  const { subjects, isLoading: subjectsLoading, error: subjectsError, fetchSubjects } = useSubjectStore();
  
  useEffect(() => {
    fetchSubjects();
    if (user) {
      fetchUserTestResults(user.id);
    }
  }, [fetchSubjects, fetchUserTestResults, user]);

  const getTestStatus = (subjectId: string) => {
    if (!user) return 'unauthenticated';
    
    const result = userTestResults.find(r => r.subject === subjects.find(s => s.id === subjectId)?.name);
    if (!result) return 'not-taken';
    
    return result.passed ? 'passed' : 'failed';
  };

  const isLoading = testLoading || subjectsLoading;
  const error = testError || subjectsError;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">CSE Subject Certification</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get certified in Computer Science Engineering subjects. Pass the certification test with at least 70% to become a validated teacher for that subject.
        </p>
      </div>
      
      {!isAuthenticated ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Sign in to get certified</h3>
          <p className="mb-6">You need to be signed in to take certification tests and view your results.</p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Register</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {[1, 2, 3, 4].map(year => (
            <div key={year}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Year {year}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects
                  .filter(subject => subject.year === year)
                  .map(subject => {
                    const status = getTestStatus(subject.id);
                    
                    return (
                      <Card key={subject.id} className="h-full flex flex-col">
                        <CardContent className="p-6 flex-grow flex flex-col">
                          <div className="mb-6 flex items-center justify-center">
                            {status === 'passed' ? (
                              <div className="bg-green-100 p-4 rounded-full">
                                <Award className="h-10 w-10 text-green-600" />
                              </div>
                            ) : (
                              <div className="bg-blue-100 p-4 rounded-full">
                                <BookOpen className="h-10 w-10 text-blue-600" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant="primary">{subject.code}</Badge>
                            <Badge variant={subject.semester === 1 ? "success" : "warning"}>
                              Semester {subject.semester}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-center mb-2">{subject.name}</h3>
                          <p className="text-gray-600 text-sm mb-4 text-center flex-grow">
                            {subject.description}
                          </p>
                          
                          {status === 'passed' && (
                            <div className="mt-4 mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-md flex items-center">
                              <CheckCircle className="h-5 w-5 mr-2" />
                              <span>Certified Teacher</span>
                            </div>
                          )}
                          
                          <div className="mt-auto">
                            {status === 'passed' ? (
                              <Link to="/courses/create">
                                <Button 
                                  fullWidth
                                  rightIcon={<ArrowRight className="h-4 w-4" />}
                                >
                                  Create {subject.name} Course
                                </Button>
                              </Link>
                            ) : (
                              <Link to={`/certification/tests/${subject.id}`}>
                                <Button fullWidth>
                                  {status === 'failed' ? 'Retake Test' : 'Take Test'}
                                </Button>
                              </Link>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationPage;