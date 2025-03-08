import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  fallback,
}) => {
  const sizeStyles = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };
  
  const [imageError, setImageError] = React.useState(!src);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const getFallbackInitials = () => {
    if (fallback) return fallback;
    if (!alt) return '?';
    
    return alt
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className={`relative inline-block ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeStyles[size]} rounded-full object-cover`}
          onError={handleImageError}
        />
      ) : (
        <div className={`${sizeStyles[size]} rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium`}>
          {getFallbackInitials()}
        </div>
      )}
    </div>
  );
};

export default Avatar;