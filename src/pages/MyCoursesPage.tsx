import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import { useAuthStore } from '../store/authStore';
import CourseCard from '../components/courses/CourseCard';
import Button from '../components/ui/Button';
import { BookmarkCheck, Search } from 'lucide-react';
import Input from '../components/ui/Input';

const MyCoursesPage: React.FC = () => {
  const { userCourses, isLoading, error, fetchUserCourses } = useCourseStore();
  const { user, isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  useEffect(() => {
    if (user) {
      fetchUserCourses(user.id);
    }
  }, [user, fetchUserCourses]);
  
  const filteredCourses = userCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <BookmarkCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your courses</h2>
          <p className="text-gray-500 mb-6">You need to be logged in to see your enrolled courses.</p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Register</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookmarkCheck className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        </div>
        <p className="text-xl text-gray-600">
          Courses you've enrolled in
        </p>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search your courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          leftIcon={<Search className="h-4 w-4 text-gray-400" />}
        />
      </div>
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <BookmarkCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? "No courses match your search" : "You haven't enrolled in any courses yet"}
          </h2>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? "Try adjusting your search terms or clear the search" 
              : "Browse our catalog and enroll in courses that interest you"}
          </p>
          <Link to="/subjects">
            <Button>
              Explore Subjects
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;