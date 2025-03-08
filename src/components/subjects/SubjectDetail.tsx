import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSubjectStore } from '../../store/subjectStore';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { useTestStore } from '../../store/testStore';
import { BookOpen, Video, Clock, Calendar, User, Play, Upload, Plus, BookmarkCheck, Award, Lock } from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { format } from 'date-fns';
import { DemoVideo } from '../../types';

const SubjectDetail: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { currentSubject, isLoading, error, fetchSubjectById, addDemoVideo } = useSubjectStore();
  const { user, isAuthenticated } = useAuthStore();
  const { enrollInCourse, fetchCourses, courses } = useCourseStore();
  const { userTestResults } = useTestStore();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    url: '',
    thumbnailUrl: '',
    duration: ''
  });
  const [selectedVideo, setSelectedVideo] = useState<DemoVideo | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);
  
  useEffect(() => {
    if (subjectId) {
      fetchSubjectById(subjectId);
    }
  }, [subjectId, fetchSubjectById]);
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    if (currentSubject && courses.length > 0) {
      const filtered = courses.filter(course => course.subject === currentSubject.name);
      setRelatedCourses(filtered);
    }
  }, [currentSubject, courses]);

  const canUploadVideos = React.useMemo(() => {
    if (!isAuthenticated || !user) return false;
    
    // Check if user is validated teacher
    if (!user.isValidatedTeacher) return false;
    
    // Check if user has passed the certification test for this subject
    const subjectTest = userTestResults.find(
      result => result.subject === currentSubject?.name && result.passed
    );
    
    return !!subjectTest;
  }, [isAuthenticated, user, userTestResults, currentSubject]);
  
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !user) return;
    
    setIsUploading(true);
    try {
      await addDemoVideo(subjectId, {
        ...uploadFormData,
        instructorId: user.id,
        instructorName: user.name
      });
      
      // Reset form
      setUploadFormData({
        title: '',
        url: '',
        thumbnailUrl: '',
        duration: ''
      });
      
      // Close upload form
      setIsUploading(false);
    } catch (error) {
      console.error('Failed to upload video:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUploadFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleVideoSelect = (video: DemoVideo) => {
    setSelectedVideo(video);
  };
  
  const handleEnrollInCourse = async (courseId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      try {
        await enrollInCourse(courseId, user.id);
        // Show success message or redirect
        navigate(`/courses/${courseId}`);
      } catch (error) {
        console.error('Failed to enroll:', error);
      }
    }
  };
  
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
  
  if (!currentSubject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Subject not found.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">{currentSubject.code}</Badge>
              <Badge variant={currentSubject.semester === 1 ? "success" : "warning"}>
                Year {currentSubject.year}, Semester {currentSubject.semester}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{currentSubject.name}</h1>
          </div>
          
          {!isAuthenticated ? (
            <Link to="/login">
              <Button>Sign in to Upload Videos</Button>
            </Link>
          ) : !user?.isValidatedTeacher ? (
            <Link to="/certification">
              <Button leftIcon={<Award className="h-4 w-4" />}>
                Get Certified to Upload
              </Button>
            </Link>
          ) : !canUploadVideos ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Lock className="h-4 w-4" />
              <span>Pass certification test to upload videos</span>
            </div>
          ) : (
            <Button 
              leftIcon={<Upload className="h-4 w-4" />}
              onClick={() => setIsUploading(!isUploading)}
            >
              Upload Demo Video
            </Button>
          )}
        </div>
        
        <p className="text-lg text-gray-600">{currentSubject.description}</p>
      </div>
      
      {isUploading && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Upload Demo Video</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={uploadFormData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter video title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={uploadFormData.url}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://example.com/video"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  name="thumbnailUrl"
                  value={uploadFormData.thumbnailUrl}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (e.g., "10:30")
                </label>
                <input
                  type="text"
                  name="duration"
                  value={uploadFormData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="MM:SS"
                  pattern="[0-9]+:[0-5][0-9]"
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsUploading(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  Upload Video
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className={`${selectedVideo ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Demo Videos</h2>
          
          {currentSubject.demoVideos.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No demo videos available for this subject yet.</p>
              {canUploadVideos ? (
                <Button 
                  leftIcon={<Upload className="h-4 w-4" />}
                  onClick={() => setIsUploading(true)}
                >
                  Upload First Demo Video
                </Button>
              ) : isAuthenticated ? (
                <p className="text-gray-400 text-sm">
                  Get certified and validated as a teacher to upload demo videos.
                </p>
              ) : (
                <p className="text-gray-400 text-sm">
                  Sign in to upload demo videos for this subject.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSubject.demoVideos.map((video) => (
                <Card 
                  key={video.id} 
                  className={`overflow-hidden cursor-pointer transition-all ${selectedVideo?.id === video.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="relative">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-all">
                        <Play className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <User className="h-4 w-4 mr-1" />
                      <span>{video.instructorName}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{video.uploadDate}</span>
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {selectedVideo && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Watch & Enroll</h2>
              </CardHeader>
              <CardContent>
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-4">
                  <iframe
                    src={selectedVideo.url}
                    title={selectedVideo.title}
                    className="w-full h-48 rounded-lg"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{selectedVideo.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Instructor: {selectedVideo.instructorName}
                </p>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Related Courses</h4>
                  
                  {relatedCourses.length === 0 ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500 mb-2">No related courses found.</p>
                      
                      {isAuthenticated ? (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h5 className="font-medium text-gray-900 mb-2">Interested in this subject?</h5>
                          <p className="text-sm text-gray-600 mb-3">
                            Enroll in a course about {currentSubject.name} when available or get certified to teach it yourself.
                          </p>
                          <div className="space-y-2">
                            <Link to="/courses">
                              <Button 
                                size="sm" 
                                fullWidth
                                leftIcon={<BookmarkCheck className="h-4 w-4" />}
                              >
                                Browse All Courses
                              </Button>
                            </Link>
                            <Link to="/certification">
                              <Button 
                                size="sm" 
                                variant="outline"
                                fullWidth
                                leftIcon={<Award className="h-4 w-4" />}
                              >
                                Get Certified to Teach
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h5 className="font-medium text-gray-900 mb-2">Sign in to enroll</h5>
                          <p className="text-sm text-gray-600 mb-3">
                            Create an account or sign in to enroll in courses.
                          </p>
                          <div className="space-y-2">
                            <Link to="/login">
                              <Button 
                                size="sm" 
                                fullWidth
                              >
                                Sign In
                              </Button>
                            </Link>
                            <Link to="/register">
                              <Button 
                                size="sm" 
                                variant="outline"
                                fullWidth
                              >
                                Create Account
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {relatedCourses.map(course => (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-3">
                          <h5 className="font-medium text-gray-900 mb-1">{course.title}</h5>
                          <div className="flex items-center justify-between text-sm mb-3">
                            <span className="text-gray-500">{course.instructorName}</span>
                            <Badge variant="primary">{course.subject}</Badge>
                          </div>
                          <Button 
                            size="sm" 
                            fullWidth
                            leftIcon={<BookmarkCheck className="h-4 w-4" />}
                            onClick={() => handleEnrollInCourse(course.id)}
                          >
                            Enroll Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <Link to="/subjects">
          <Button variant="outline">
            Back to All Subjects
          </Button>
        </Link>
        
        <Link to="/certification">
          <Button leftIcon={<Award className="h-4 w-4" />}>
            Get Certified to Teach {currentSubject.name}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SubjectDetail;