import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { Send, Users } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { format } from 'date-fns';

const CourseChat: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { messages, isConnected, isLoading, error, connectToChat, fetchMessages, sendMessage } = useChatStore();
  const { user } = useAuthStore();
  const { currentCourse, fetchCourseById } = useCourseStore();
  
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId);
    }
  }, [courseId, fetchCourseById]);
  
  useEffect(() => {
    if (user && !isConnected) {
      connectToChat(user.id, user.name);
    }
  }, [user, isConnected, connectToChat]);
  
  useEffect(() => {
    if (courseId && isConnected) {
      fetchMessages(courseId);
    }
  }, [courseId, isConnected, fetchMessages]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !courseId) return;
    
    sendMessage(courseId, messageInput);
    setMessageInput('');
  };
  
  const courseMessages = courseId ? messages[courseId] || [] : [];
  
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
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <h1 className="text-lg font-semibold text-gray-900">
          {currentCourse?.title || 'Course'} Chat
        </h1>
        <div className="ml-auto flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          <span>{currentCourse?.enrolledStudents || 0} participants</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {courseMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Be the first to send a message!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courseMessages.map((message) => {
              const isCurrentUser = user?.id === message.senderId;
              
              return (
                <div 
                  key={message.id} 
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar 
                      fallback={message.senderName.charAt(0)} 
                      size="sm" 
                      className={`${isCurrentUser ? 'ml-2' : 'mr-2'}`}
                    />
                    
                    <div>
                      <div className={`flex items-baseline ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500 mr-2">
                          {format(new Date(message.timestamp), 'h:mm a')}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {message.senderName}
                        </span>
                      </div>
                      
                      <div 
                        className={`mt-1 px-4 py-2 rounded-lg ${
                          isCurrentUser 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white border border-gray-200 rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-l-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button 
            type="submit" 
            className="rounded-l-none"
            disabled={!messageInput.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CourseChat;