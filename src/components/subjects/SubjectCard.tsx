import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video } from 'lucide-react';
import { CSESubject } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface SubjectCardProps {
  subject: CSESubject;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <Link to={`/subjects/${subject.id}`} className="block h-full">
        <div className="relative">
          <img 
            src={subject.thumbnailUrl} 
            alt={subject.name} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Badge variant="primary">
              {subject.code}
            </Badge>
            <Badge variant={subject.semester === 1 ? "success" : "warning"}>
              Year {subject.year}, Sem {subject.semester}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{subject.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{subject.description}</p>
          
          <div className="flex items-center text-sm text-gray-500 mt-auto">
            <Video className="h-4 w-4 mr-1" />
            <span>{subject.demoVideos.length} demo videos</span>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">CSE Curriculum</span>
            <span className="text-sm font-medium text-blue-600">View Details</span>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default SubjectCard;