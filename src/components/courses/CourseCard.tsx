import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Clock } from 'lucide-react';
import { Course } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card className="h-full flex flex-col">
      <Link to={`/courses/${course.id}`} className="block">
        <div className="relative">
          <img 
            src={course.thumbnailUrl} 
            alt={course.title} 
            className="w-full h-48 object-cover"
          />
          <Badge 
            variant="primary" 
            className="absolute top-2 right-2"
          >
            {course.subject}
          </Badge>
        </div>
        
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
          
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.enrolledStudents} students</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.schedule.length} sessions</span>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{course.rating.toFixed(1)}</span>
              </div>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">{course.reviewCount} reviews</span>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Instructor: {course.instructorName}</span>
            <span className="text-sm font-medium text-blue-600">View Details</span>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default CourseCard;