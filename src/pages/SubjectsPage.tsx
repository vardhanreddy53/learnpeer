import React from 'react';
import SubjectList from '../components/subjects/SubjectList';
import { BookOpen } from 'lucide-react';

const SubjectsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">CSE Curriculum</h1>
        </div>
        <p className="text-xl text-gray-600">
          Explore Computer Science Engineering subjects from 1st year to 4th year
        </p>
      </div>
      
      <SubjectList />
    </div>
  );
};

export default SubjectsPage;