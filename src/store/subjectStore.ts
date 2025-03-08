import { create } from 'zustand';
import { CSESubject, DemoVideo } from '../types';

interface SubjectState {
  subjects: CSESubject[];
  currentSubject: CSESubject | null;
  isLoading: boolean;
  error: string | null;
  fetchSubjects: () => Promise<void>;
  fetchSubjectById: (subjectId: string) => Promise<void>;
  addDemoVideo: (subjectId: string, video: Partial<DemoVideo>) => Promise<void>;
  clearError: () => void;
}

// Mock data for CSE subjects
const mockCSESubjects: CSESubject[] = [
  // 1st Year, 1st Semester
  {
    id: 'cse101',
    name: 'Introduction to Computer Science',
    code: 'CSE101',
    year: 1,
    semester: 1,
    description: 'Fundamental concepts of computer science, including problem-solving, algorithms, and programming basics.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: [
      {
        id: 'v1',
        title: 'Introduction to Algorithms',
        url: 'https://example.com/videos/intro-algorithms',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        instructorId: '3',
        instructorName: 'Jane Smith',
        duration: '15:30',
        uploadDate: '2023-01-15',
        views: 1250
      }
    ]
  },
  {
    id: 'math101',
    name: 'Calculus I',
    code: 'MATH101',
    year: 1,
    semester: 1,
    description: 'Introduction to differential and integral calculus of functions of one variable.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: [
      {
        id: 'v2',
        title: 'Limits and Continuity',
        url: 'https://example.com/videos/limits',
        thumbnailUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        instructorId: '3',
        instructorName: 'Jane Smith',
        duration: '12:45',
        uploadDate: '2023-01-20',
        views: 980
      }
    ]
  },
  {
    id: 'phy101',
    name: 'Physics I',
    code: 'PHY101',
    year: 1,
    semester: 1,
    description: 'Mechanics, kinematics, dynamics, and conservation laws.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  
  // 1st Year, 2nd Semester
  {
    id: 'cse102',
    name: 'Programming Fundamentals',
    code: 'CSE102',
    year: 1,
    semester: 2,
    description: 'Introduction to programming concepts using a high-level language.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: [
      {
        id: 'v3',
        title: 'Variables and Data Types',
        url: 'https://example.com/videos/variables',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        instructorId: '4',
        instructorName: 'Robert Johnson',
        duration: '18:20',
        uploadDate: '2023-02-05',
        views: 1560
      }
    ]
  },
  {
    id: 'math102',
    name: 'Calculus II',
    code: 'MATH102',
    year: 1,
    semester: 2,
    description: 'Techniques of integration, infinite series, and applications.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'phy102',
    name: 'Physics II',
    code: 'PHY102',
    year: 1,
    semester: 2,
    description: 'Electricity, magnetism, and electromagnetic waves.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581093458791-9d15482442f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  
  // 2nd Year, 1st Semester
  {
    id: 'cse201',
    name: 'Data Structures',
    code: 'CSE201',
    year: 2,
    semester: 1,
    description: 'Implementation and analysis of fundamental data structures.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: [
      {
        id: 'v4',
        title: 'Arrays and Linked Lists',
        url: 'https://example.com/videos/arrays',
        thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        instructorId: '1',
        instructorName: 'Test User',
        duration: '22:15',
        uploadDate: '2023-03-10',
        views: 2100
      }
    ]
  },
  {
    id: 'cse202',
    name: 'Digital Logic Design',
    code: 'CSE202',
    year: 2,
    semester: 1,
    description: 'Boolean algebra, logic gates, and digital circuit design.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'math201',
    name: 'Discrete Mathematics',
    code: 'MATH201',
    year: 2,
    semester: 1,
    description: 'Sets, relations, functions, and graph theory for computer science.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  
  // 2nd Year, 2nd Semester
  {
    id: 'cse203',
    name: 'Object-Oriented Programming',
    code: 'CSE203',
    year: 2,
    semester: 2,
    description: 'Principles of object-oriented design and programming.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'cse204',
    name: 'Computer Architecture',
    code: 'CSE204',
    year: 2,
    semester: 2,
    description: 'Organization and design of computer systems.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'cse205',
    name: 'Algorithms',
    code: 'CSE205',
    year: 2,
    semester: 2,
    description: 'Design and analysis of algorithms for problem-solving.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  
  // 3rd Year, 1st Semester
  {
    id: 'cse301',
    name: 'Database Systems',
    code: 'CSE301',
    year: 3,
    semester: 1,
    description: 'Design and implementation of database management systems.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'cse302',
    name: 'Operating Systems',
    code: 'CSE302',
    year: 3,
    semester: 1,
    description: 'Principles of operating system design and implementation.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'cse303',
    name: 'Software Engineering',
    code: 'CSE303',
    year: 3,
    semester: 1,
    description: 'Methodologies and practices for developing software systems.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  
  // 3rd Year, 2nd Semester
  {
    id: 'cse304',
    name: 'Computer Networks',
    code: 'CSE304',
    year: 3,
    semester: 2,
    description: 'Principles and practice of computer networking.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'cse305',
    name: 'Web Development',
    code: 'CSE305',
    year: 3,
    semester: 2,
    description: 'Technologies and frameworks for building web applications.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'cse306',
    name: 'Artificial Intelligence',
    code: 'CSE306',
    year: 3,
    semester: 2,
    description: 'Fundamentals of AI including search, knowledge representation, and learning.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  
  // 4th Year, 1st Semester
  {
    id: 'cse401',
    name: 'Machine Learning',
    code: 'CSE401',
    year: 4,
    semester: 1,
    description: 'Algorithms and techniques for learning from data.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'cse402',
    name: 'Computer Graphics',
    code: 'CSE402',
    year: 4,
    semester: 1,
    description: 'Principles and algorithms for generating and manipulating digital images.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'cse403',
    name: 'Information Security',
    code: 'CSE403',
    year: 4,
    semester: 1,
    description: 'Principles and practices for secure computing systems.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  
  // 4th Year, 2nd Semester
  {
    id: 'cse404',
    name: 'Cloud Computing',
    code: 'CSE404',
    year: 4,
    semester: 2,
    description: 'Concepts and technologies for distributed computing services.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'cse405',
    name: 'Mobile Application Development',
    code: 'CSE405',
    year: 4,
    semester: 2,
    description: 'Design and development of applications for mobile devices.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  },
  {
    id: 'cse406',
    name: 'Capstone Project',
    code: 'CSE406',
    year: 4,
    semester: 2,
    description: 'Culminating project demonstrating mastery of computer science concepts.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    demoVideos: []
  }
];

export const useSubjectStore = create<SubjectState>((set, get) => ({
  subjects: [],
  currentSubject: null,
  isLoading: false,
  error: null,
  
  fetchSubjects: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ subjects: mockCSESubjects, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch subjects', isLoading: false });
    }
  },
  
  fetchSubjectById: async (subjectId) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const subject = mockCSESubjects.find(s => s.id === subjectId) || null;
      set({ currentSubject: subject, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch subject details', isLoading: false });
    }
  },
  
  addDemoVideo: async (subjectId, videoData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newVideo: DemoVideo = {
        id: `v${Date.now()}`,
        title: videoData.title || 'Untitled Video',
        url: videoData.url || '',
        thumbnailUrl: videoData.thumbnailUrl || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        instructorId: videoData.instructorId || '',
        instructorName: videoData.instructorName || '',
        duration: videoData.duration || '0:00',
        uploadDate: new Date().toISOString().split('T')[0],
        views: 0
      };
      
      set(state => {
        const updatedSubjects = state.subjects.map(subject => {
          if (subject.id === subjectId) {
            return {
              ...subject,
              demoVideos: [...subject.demoVideos, newVideo]
            };
          }
          return subject;
        });
        
        const updatedCurrentSubject = state.currentSubject?.id === subjectId
          ? {
              ...state.currentSubject,
              demoVideos: [...(state.currentSubject.demoVideos || []), newVideo]
            }
          : state.currentSubject;
        
        return {
          subjects: updatedSubjects,
          currentSubject: updatedCurrentSubject,
          isLoading: false
        };
      });
    } catch (error) {
      set({ error: 'Failed to add demo video', isLoading: false });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));