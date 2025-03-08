import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Video, ArrowRight, BookOpenCheck, Layers } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Student-Led Learning Platform for CSE Students
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                A platform where students become educators, sharing knowledge and expertise across the Computer Science Engineering curriculum.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/subjects">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                    Explore CSE Subjects
                  </Button>
                </Link>
                <Link to="/certification">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                    Get Certified to Teach
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Students learning together" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform empowers students to learn from peers and become educators themselves
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Certified</h3>
                <p className="text-gray-600">
                  Take subject-specific certification tests to validate your knowledge and become eligible to teach.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <BookOpenCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Validated</h3>
                <p className="text-gray-600">
                  Submit your credentials to become a validated teacher and gain access to create content.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <Video className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Knowledge</h3>
                <p className="text-gray-600">
                  Create demo videos, teach courses, and help fellow students master complex subjects.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CSE Curriculum Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">CSE Curriculum</h2>
              <p className="text-xl text-gray-600">
                Comprehensive coverage of Computer Science Engineering subjects
              </p>
            </div>
            <Link to="/subjects" className="mt-4 md:mt-0">
              <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All Subjects
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(year => (
              <Card key={year} className="hover:shadow-lg transition-shadow">
                <Link to={`/subjects?year=${year}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Layers className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-blue-600">Year {year}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {year === 1 ? 'Foundation' : 
                       year === 2 ? 'Core Concepts' : 
                       year === 3 ? 'Advanced Topics' : 
                       'Specialization'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {year === 1 ? 'Basic programming, mathematics, and physics fundamentals' : 
                       year === 2 ? 'Data structures, algorithms, and computer architecture' : 
                       year === 3 ? 'Databases, networks, and software engineering' : 
                       'AI, cloud computing, and capstone projects'}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start learning or teaching?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join our community of student educators and learners today. Share knowledge, grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-gray-800">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;