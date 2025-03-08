export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  certifications: Certification[];
  enrolledCourses: string[];
  teachingCourses: string[];
  isValidatedTeacher?: boolean;
  teacherCredentials?: TeacherCredentials;
}

export interface TeacherCredentials {
  institution: string;
  degree: string;
  graduationYear: string;
  specialization: string;
  experience: number;
  documentUrls: string[];
  validationStatus: 'pending' | 'approved' | 'rejected';
  validationDate?: string;
}

export interface Certification {
  id: string;
  subject: string;
  score: number;
  issuedDate: string;
  expiryDate: string;
  status: 'active' | 'expired';
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  instructorId: string;
  instructorName: string;
  demoVideoUrl: string;
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;
  schedule: Schedule[];
  enrolledStudents: number;
  createdAt: string;
  updatedAt: string;
  semester?: string;
  year?: number;
}

export interface Schedule {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  courseId: string;
}

export interface Test {
  id: string;
  subject: string;
  questions: Question[];
  passingScore: number;
  timeLimit: number; // in minutes
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  subject: string;
  score: number;
  passed: boolean;
  completedAt: string;
}

export interface CSESubject {
  id: string;
  name: string;
  code: string;
  year: number;
  semester: number;
  description: string;
  thumbnailUrl: string;
  demoVideos: DemoVideo[];
}

export interface DemoVideo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  instructorId: string;
  instructorName: string;
  duration: string;
  uploadDate: string;
  views: number;
}