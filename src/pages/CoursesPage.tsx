import React from 'react';
import CourseList from '../components/courses/CourseList';

const CoursesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Courses</h1>
        <p className="text-xl text-gray-600">
          Discover courses taught by certified student instructors across various subjects.
        </p>
      </div>
      
      <CourseList />
    </div>
  );
};

export default CoursesPage;