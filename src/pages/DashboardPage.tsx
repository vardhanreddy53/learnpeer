import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import { useTestStore } from '../store/testStore';
import { BookOpen, Award, Video, Plus, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { userCourses, teachingCourses, fetchUserCourses, fetchTeachingCourses } = useCourseStore();
  const { userTestResults, fetchUserTestResults } = useTestStore();
  
  useEffect(() => {
    if (user) {
      fetchUserCourses(user.id);
      fetchTeachingCourses(user.id);
      fetchUserTestResults(user.id);
    }
  }, [user, fetchUserCourses, fetchTeachingCourses, fetchUserTestResults]);
  
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-gray-500">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }
  
  // Get upcoming sessions from enrolled courses
  const upcomingSessions = userCourses.flatMap(course => 
    course.schedule.map(session => ({
      ...session,
      courseTitle: course.title,
      courseId: course.id
    }))
  ).filter(session => new Date(session.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-xl text-gray-600 mt-2">Welcome back, {user.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Enrolled Courses</h3>
                <p className="text-3xl font-bold text-gray-900">{userCourses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Teaching Courses</h3>
                <p className="text-3xl font-bold text-gray-900">{teachingCourses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
                <p className="text-3xl font-bold text-gray-900">{user.certifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">My Enrolled Courses</h2>
                <Link to="/courses">
                  <Button variant="outline" size="sm">Browse Courses</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {userCourses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                  <Link to="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userCourses.map(course => (
                    <Link key={course.id} to={`/courses/${course.id}`}>
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.title} 
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="ml-4 flex-grow">
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-500">Instructor: {course.instructorName}</p>
                        </div>
                        <Badge variant="primary">{course.subject}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">My Teaching Courses</h2>
                <Link to="/courses/create">
                  <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    Create Course
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {teachingCourses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
                  {user.certifications.length > 0 ? (
                    <Link to="/courses/create">
                      <Button>Create Your First Course</Button>
                    </Link>
                  ) : (
                    <Link to="/certification">
                      <Button>Get Certified to Teach</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {teachingCourses.map(course => (
                    <Link key={course.id} to={`/courses/${course.id}/manage`}>
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.title} 
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="ml-4 flex-grow">
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{course.enrolledStudents} students</span>
                            <span className="mx-2">•</span>
                            <span>{course.schedule.length} sessions</span>
                          </div>
                        </div>
                        <Badge variant="primary">{course.subject}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">My Certifications</h2>
            </CardHeader>
            <CardContent className="p-6">
              {user.certifications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any certifications yet.</p>
                  <Link to="/certification">
                    <Button>Get Certified</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.certifications.map(cert => (
                    <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Award className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="font-medium text-gray-900">{cert.subject} Certification</h3>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Score:</span>
                        <span className="font-medium">{cert.score}%</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Issued:</span>
                        <span>{format(new Date(cert.issuedDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Status:</span>
                        <Badge variant={cert.status === 'active' ? 'success' : 'danger'}>
                          {cert.status === 'active' ? 'Active' : 'Expired'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
            </CardHeader>
            <CardContent className="p-6">
              {upcomingSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming sessions</p>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <Link to={`/courses/${session.courseId}`}>
                        <h3 className="font-medium text-gray-900 mb-1">{session.courseTitle}</h3>
                      </Link>
                      <p className="text-sm text-gray-700 mb-2">{session.topic}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {format(new Date(session.date), 'MMM d, yyyy')} • {session.startTime} - {session.endTime}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;