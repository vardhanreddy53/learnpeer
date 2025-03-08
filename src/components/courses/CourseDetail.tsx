import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseStore } from '../../store/courseStore';
import { useAuthStore } from '../../store/authStore';
import { Star, Users, Calendar, Clock, Video } from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { format } from 'date-fns';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentCourse, isLoading, error, fetchCourseById, enrollInCourse } = useCourseStore();
  const { user, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId);
    }
  }, [courseId, fetchCourseById]);
  
  const handleEnroll = () => {
    if (courseId && user) {
      enrollInCourse(courseId, user.id);
    }
  };
  
  const isEnrolled = user?.enrolledCourses.includes(courseId || '');
  const isInstructor = currentCourse?.instructorId === user?.id;
  
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
  
  if (!currentCourse) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Course not found.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={currentCourse.thumbnailUrl} 
              alt={currentCourse.title} 
              className="w-full h-64 object-cover"
            />
            
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="primary">{currentCourse.subject}</Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm font-medium">{currentCourse.rating.toFixed(1)}</span>
                  <span className="ml-1 text-sm text-gray-500">({currentCourse.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="h-4 w-4" />
                  <span className="ml-1 text-sm">{currentCourse.enrolledStudents} students</span>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{currentCourse.title}</h1>
              
              <p className="text-gray-700 mb-6">{currentCourse.description}</p>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h2>
                <div className="flex items-center">
                  <Avatar size="lg" fallback={currentCourse.instructorName.charAt(0)} />
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-gray-900">{currentCourse.instructorName}</h3>
                    <p className="text-sm text-gray-500">Certified {currentCourse.subject} Instructor</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Video</h2>
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Demo video available after enrollment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Class Schedule</h2>
              
              {currentCourse.schedule.length === 0 ? (
                <p className="text-gray-500">No scheduled classes yet.</p>
              ) : (
                <div className="space-y-4">
                  {currentCourse.schedule.map((session) => (
                    <Card key={session.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{session.topic}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{format(new Date(session.date), 'MMMM d, yyyy')}</span>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{session.startTime} - {session.endTime}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
            <div className="p-6">
              {isAuthenticated ? (
                isEnrolled ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md">
                      You are enrolled in this course
                    </div>
                    <Link to={`/courses/${courseId}/chat`}>
                      <Button fullWidth>
                        Go to Course Chat
                      </Button>
                    </Link>
                    <Link to={`/courses/${courseId}/materials`}>
                      <Button variant="outline" fullWidth>
                        View Course Materials
                      </Button>
                    </Link>
                  </div>
                ) : isInstructor ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-md">
                      You are the instructor of this course
                    </div>
                    <Link to={`/courses/${courseId}/manage`}>
                      <Button fullWidth>
                        Manage Course
                      </Button>
                    </Link>
                    <Link to={`/courses/${courseId}/chat`}>
                      <Button variant="outline" fullWidth>
                        Go to Course Chat
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button 
                    fullWidth 
                    size="lg" 
                    onClick={handleEnroll}
                  >
                    Enroll in Course
                  </Button>
                )
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">Sign in to enroll in this course</p>
                  <Link to="/login">
                    <Button fullWidth>
                      Login to Enroll
                    </Button>
                  </Link>
                </div>
              )}
              
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Course Details</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Subject</span>
                    <span className="font-medium text-gray-900">{currentCourse.subject}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Sessions</span>
                    <span className="font-medium text-gray-900">{currentCourse.schedule.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Students</span>
                    <span className="font-medium text-gray-900">{currentCourse.enrolledStudents}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="font-medium text-gray-900">{format(new Date(currentCourse.createdAt), 'MMM d, yyyy')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="font-medium text-gray-900">{format(new Date(currentCourse.updatedAt), 'MMM d, yyyy')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;