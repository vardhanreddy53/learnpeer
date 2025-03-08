import { create } from 'zustand';
import { Test, TestResult, Question } from '../types';
import { useAuthStore } from './authStore';
import { useCourseStore } from './courseStore';
import { useSubjectStore } from './subjectStore';

interface TestState {
  tests: Test[];
  currentTest: Test | null;
  userTestResults: TestResult[];
  isLoading: boolean;
  error: string | null;
  fetchTests: () => Promise<void>;
  fetchTestById: (testId: string) => Promise<void>;
  fetchUserTestResults: (userId: string) => Promise<void>;
  submitTest: (userId: string, testId: string, answers: number[]) => Promise<TestResult>;
  clearError: () => void;
}

export const useTestStore = create<TestState>((set, get) => ({
  tests: [],
  currentTest: null,
  userTestResults: [],
  isLoading: false,
  error: null,
  
  fetchTests: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ tests: [], isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tests', isLoading: false });
    }
  },
  
  fetchTestById: async (subjectId) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const subjectStore = useSubjectStore.getState();
      const subject = subjectStore.subjects.find(s => s.id === subjectId);
      
      if (!subject) {
        throw new Error('Subject not found');
      }
      
      const test: Test = {
        id: subjectId,
        subject: subject.name,
        questions: [
          {
            id: 'q1',
            text: 'What is the time complexity of quicksort in the average case?',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
            correctOptionIndex: 1
          },
          {
            id: 'q2',
            text: 'Which data structure uses LIFO principle?',
            options: ['Queue', 'Stack', 'Tree', 'Graph'],
            correctOptionIndex: 1
          },
          {
            id: 'q3',
            text: 'What is inheritance in OOP?',
            options: [
              'Creating multiple instances of a class',
              'A mechanism that allows a class to inherit properties from another class',
              'A way to hide implementation details',
              'A method to overload operators'
            ],
            correctOptionIndex: 1
          },
          {
            id: 'q4',
            text: 'What is the purpose of normalization in databases?',
            options: [
              'To increase data redundancy',
              'To organize data efficiently and reduce data redundancy',
              'To create more tables',
              'To improve query performance only'
            ],
            correctOptionIndex: 1
          },
          {
            id: 'q5',
            text: 'Which protocol is used for secure communication over the internet?',
            options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
            correctOptionIndex: 2
          }
        ],
        passingScore: 70,
        timeLimit: 30
      };
      
      set({ currentTest: test, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch test details', isLoading: false });
    }
  },
  
  fetchUserTestResults: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return actual test results instead of empty array
      const results = get().userTestResults.filter(result => result.userId === userId);
      set({ userTestResults: results, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch test results', isLoading: false });
    }
  },
  
  submitTest: async (userId, testId, answers) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const test = get().currentTest;
      if (!test) {
        throw new Error('Test not found');
      }
      
      let correctAnswers = 0;
      test.questions.forEach((question, index) => {
        if (answers[index] === question.correctOptionIndex) {
          correctAnswers++;
        }
      });
      
      const score = Math.round((correctAnswers / test.questions.length) * 100);
      const passed = score >= test.passingScore;
      
      const result: TestResult = {
        id: `result${Date.now()}`,
        userId,
        testId,
        subject: test.subject,
        score,
        passed,
        completedAt: new Date().toISOString()
      };
      
      if (passed) {
        const authStore = useAuthStore.getState();
        
        // Add certification
        const certification = {
          id: `cert${Date.now()}`,
          subject: test.subject,
          score,
          issuedDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year validity
          status: 'active' as const
        };
        
        // Update user with new certification and teacher status
        if (authStore.user) {
          const updatedUser = {
            ...authStore.user,
            certifications: [...authStore.user.certifications, certification],
            isValidatedTeacher: true
          };
          authStore.validateTeacher(userId, true);
        }
      }
      
      set(state => ({
        userTestResults: [...state.userTestResults, result],
        isLoading: false
      }));
      
      return result;
    } catch (error) {
      set({ error: 'Failed to submit test', isLoading: false });
      throw error;
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));