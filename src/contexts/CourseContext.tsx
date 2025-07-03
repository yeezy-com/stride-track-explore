import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockCourses } from '../data/mockData';

interface Course {
  id: number;
  name: string;
  location: string;
  distance: number;
  difficulty: string;
  estimatedTime: string;
  likes: number;
  completedCount: number;
  tags?: string[];
  description?: string;
  coordinates?: [number, number][];
}

interface CourseContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'likes' | 'completedCount'>) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);

  const addCourse = (newCourse: Omit<Course, 'id' | 'likes' | 'completedCount'>) => {
    const course: Course = {
      ...newCourse,
      id: Math.max(...courses.map(c => c.id)) + 1,
      likes: 0,
      completedCount: 0,
      distance: parseFloat(newCourse.distance.toString()) || 0,
    };
    setCourses(prev => [...prev, course]);
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse }}>
      {children}
    </CourseContext.Provider>
  );
};
