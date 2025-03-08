import React, { useEffect, useState } from 'react';
import { useSubjectStore } from '../../store/subjectStore';
import SubjectCard from './SubjectCard';
import { Search, Filter, BookOpen } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SubjectList: React.FC = () => {
  const { subjects, isLoading, error, fetchSubjects } = useSubjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);
  
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          subject.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear ? subject.year === selectedYear : true;
    const matchesSemester = selectedSemester ? subject.semester === selectedSemester : true;
    
    return matchesSearch && matchesYear && matchesSemester;
  });
  
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
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        
        <div className="flex gap-4">
          <select
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          
          <select
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={selectedSemester || ''}
            onChange={(e) => setSelectedSemester(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">All Semesters</option>
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
          </select>
        </div>
      </div>
      
      {filteredSubjects.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No subjects found matching your criteria.</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map(subject => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectList;