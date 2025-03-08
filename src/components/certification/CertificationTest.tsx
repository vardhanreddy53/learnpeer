import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTestStore } from '../../store/testStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Clock, AlertCircle } from 'lucide-react';

const CertificationTest: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { currentTest, isLoading, error, fetchTestById, submitTest } = useTestStore();
  const { user } = useAuthStore();
  
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (testId) {
      fetchTestById(testId);
    }
  }, [testId, fetchTestById]);
  
  useEffect(() => {
    if (currentTest) {
      setSelectedAnswers(new Array(currentTest.questions.length).fill(-1));
      setTimeLeft(currentTest.timeLimit * 60); // Convert minutes to seconds
    }
  }, [currentTest]);
  
  useEffect(() => {
    if (timeLeft === null) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = optionIndex;
      return newAnswers;
    });
  };
  
  const handleSubmit = async () => {
    if (!user || !testId || !currentTest) return;
    
    setIsSubmitting(true);
    try {
      const result = await submitTest(user.id, testId, selectedAnswers);
      navigate(`/certification/results/${result.id}`);
    } catch (error) {
      console.error('Failed to submit test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
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
  
  if (!currentTest) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Test not found.</p>
      </div>
    );
  }
  
  const allQuestionsAnswered = selectedAnswers.every(answer => answer !== -1);
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">{currentTest.subject} Certification Test</h1>
            {timeLeft !== null && (
              <div className="flex items-center mt-2 sm:mt-0 text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
          <p className="mt-2 text-gray-600">
            Answer all questions. You need {currentTest.passingScore}% to pass.
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-8">
            {currentTest.questions.map((question, questionIndex) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {questionIndex + 1}. {question.text}
                </h3>
                
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex}
                      className={`border rounded-md p-3 cursor-pointer transition-colors ${
                        selectedAnswers[questionIndex] === optionIndex 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                    >
                      <div className="flex items-center">
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedAnswers[questionIndex] === optionIndex 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswers[questionIndex] === optionIndex && (
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="flex flex-col sm:flex-row items-center justify-between w-full">
            {!allQuestionsAnswered && (
              <div className="flex items-center text-amber-600 mb-4 sm:mb-0">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Please answer all questions before submitting</span>
              </div>
            )}
            <Button 
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || isSubmitting}
              isLoading={isSubmitting}
              className="sm:ml-auto"
            >
              Submit Test
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CertificationTest;