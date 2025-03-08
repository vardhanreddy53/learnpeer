import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresTeacher?: boolean;
  requiresValidation?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresAuth = true,
  requiresTeacher = false,
  requiresValidation = false,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated && requiresAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresTeacher && !user?.isValidatedTeacher) {
    return <Navigate to="/certification" replace />;
  }

  if (requiresValidation && (!user?.isValidatedTeacher || !user?.teacherCredentials?.validationStatus === 'approved')) {
    return <Navigate to="/teacher-credentials" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;