import { create } from 'zustand';
import { Course } from '../types';

interface CourseState {
  courses: Course[];
  userCourses: Course[];
  teachingCourses: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  fetchUserCourses: (userId: string) => Promise<void>;
  fetchTeachingCourses: (userId: string) => Promise<void>;
  fetchCourseById: (courseId: string) => Promise<void>;
  createCourse: (courseData: Partial<Course>) => Promise<void>;
  updateCourse: (courseId: string, courseData: Partial<Course>) => Promise<void>;
  enrollInCourse: (courseId: string, userId: string) => Promise<void>;
  clearError: () => void;
}

// Mock data
const mockCourses: Course[] = [
  {
    id: 'course1',
    title: 'Introduction to Calculus',
    subject: 'Mathematics',
    description: 'Learn the fundamentals of calculus including limits, derivatives, and integrals.',
    instructorId: '3',
    instructorName: 'Jane Smith',
    demoVideoUrl: 'https://example.com/demo-video-1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 24,
    schedule: [
      {
        id: 'schedule1',
        courseId: 'course1',
        date: '2023-06-15',
        startTime: '10:00',
        endTime: '12:00',
        topic: 'Introduction to Limits'
      },
      {
        id: 'schedule2',
        courseId: 'course1',
        date: '2023-06-17',
        startTime: '10:00',
        endTime: '12:00',
        topic: 'Derivatives'
      }
    ],
    enrolledStudents: 45,
    createdAt: '2023-01-10',
    updatedAt: '2023-05-20'
  },
  {
    id: 'course2',
    title: 'Advanced Physics',
    subject: 'Physics',
    description: 'Explore advanced concepts in physics including quantum mechanics and relativity.',
    instructorId: '4',
    instructorName: 'Robert Johnson',
    demoVideoUrl: 'https://example.com/demo-video-2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 18,
    schedule: [
      {
        id: 'schedule3',
        courseId: 'course2',
        date: '2023-06-16',
        startTime: '14:00',
        endTime: '16:00',
        topic: 'Quantum Mechanics Basics'
      }
    ],
    enrolledStudents: 32,
    createdAt: '2023-02-05',
    updatedAt: '2023-05-15'
  }
];

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  userCourses: [],
  teachingCourses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
  
  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ courses: mockCourses, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch courses', isLoading: false });
    }
  },
  
  fetchUserCourses: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - Now returns empty array for new users
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ userCourses: [], isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user courses', isLoading: false });
    }
  },
  
  fetchTeachingCourses: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const teachingCourses = mockCourses.filter(course => 
        course.instructorId === userId
      );
      set({ teachingCourses, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch teaching courses', isLoading: false });
    }
  },
  
  fetchCourseById: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const course = mockCourses.find(c => c.id === courseId) || null;
      set({ currentCourse: course, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch course details', isLoading: false });
    }
  },
  
  createCourse: async (courseData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be handled by the backend
      const newCourse: Course = {
        id: `course${Date.now()}`,
        title: courseData.title || 'Untitled Course',
        subject: courseData.subject || 'General',
        description: courseData.description || '',
        instructorId: courseData.instructorId || '',
        instructorName: courseData.instructorName || '',
        demoVideoUrl: courseData.demoVideoUrl || '',
        thumbnailUrl: courseData.thumbnailUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        rating: 0,
        reviewCount: 0,
        schedule: courseData.schedule || [],
        enrolledStudents: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      set(state => ({ 
        courses: [...state.courses, newCourse],
        teachingCourses: [...state.teachingCourses, newCourse],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to create course', isLoading: false });
    }
  },
  
  updateCourse: async (courseId, courseData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => {
        const updatedCourses = state.courses.map(course => 
          course.id === courseId ? { ...course, ...courseData, updatedAt: new Date().toISOString() } : course
        );
        
        const updatedTeachingCourses = state.teachingCourses.map(course => 
          course.id === courseId ? { ...course, ...courseData, updatedAt: new Date().toISOString() } : course
        );
        
        return { 
          courses: updatedCourses,
          teachingCourses: updatedTeachingCourses,
          currentCourse: state.currentCourse?.id === courseId 
            ? { ...state.currentCourse, ...courseData, updatedAt: new Date().toISOString() } 
            : state.currentCourse,
          isLoading: false 
        };
      });
    } catch (error) {
      set({ error: 'Failed to update course', isLoading: false });
    }
  },
  
  enrollInCourse: async (courseId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => {
        const course = state.courses.find(c => c.id === courseId);
        if (!course) {
          throw new Error('Course not found');
        }
        
        // Add course to user's enrolled courses
        const updatedCourse = { 
          ...course, 
          enrolledStudents: course.enrolledStudents + 1,
          updatedAt: new Date().toISOString()
        };
        
        const updatedCourses = state.courses.map(c => 
          c.id === courseId ? updatedCourse : c
        );
        
        return { 
          courses: updatedCourses,
          userCourses: [...state.userCourses, updatedCourse],
          isLoading: false 
        };
      });
    } catch (error) {
      set({ error: 'Failed to enroll in course', isLoading: false });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));