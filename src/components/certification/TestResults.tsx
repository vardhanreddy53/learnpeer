import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTestStore } from '../../store/testStore';
import { useAuthStore } from '../../store/authStore';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { format } from 'date-fns';

const TestResults: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const { userTestResults, isLoading, error, fetchUserTestResults } = useTestStore();
  const { user } = useAuthStore();
  
  useEffect(() => {
    if (user) {
      fetchUserTestResults(user.id);
    }
  }, [user, fetchUserTestResults]);
  
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
  
  const result = userTestResults.find(r => r.id === resultId);
  
  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Test result not found.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">{result.subject} Certification Test Results</h1>
          <p className="mt-2 text-gray-600">
            Completed on {format(new Date(result.completedAt), 'MMMM d, yyyy')} at {format(new Date(result.completedAt), 'h:mm a')}
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center py-6">
            {result.passed ? (
              <>
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <Award className="h-16 w-16 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Congratulations!</h2>
                <p className="text-gray-700 mb-4">You have passed the certification test.</p>
              </>
            ) : (
              <>
                <div className="bg-red-100 p-4 rounded-full mb-4">
                  <XCircle className="h-16 w-16 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Not Passed</h2>
                <p className="text-gray-700 mb-4">You did not meet the passing score requirement.</p>
              </>
            )}
            
            <div className="w-full max-w-md bg-gray-100 rounded-lg p-6 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Your Score:</span>
                <span className="text-xl font-bold">{result.score}%</span>
              </div>
              
              <div className="w-full bg-gray-300 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${result.passed ? 'bg-green-600' : 'bg-red-600'}`} 
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">0%</span>
                <span className="text-xs text-gray-500">Passing: 70%</span>
                <span className="text-xs text-gray-500">100%</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {result.passed ? (
              <>
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button variant="outline" fullWidth>
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/courses/create" className="w-full sm:w-auto sm:ml-auto">
                  <Button fullWidth>
                    Create Your First Course
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/certification" className="w-full sm:w-auto">
                  <Button variant="outline" fullWidth>
                    Back to Certification
                  </Button>
                </Link>
                <Link to={`/certification/tests/${result.testId}`} className="w-full sm:w-auto sm:ml-auto">
                  <Button fullWidth>
                    Try Again
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestResults;