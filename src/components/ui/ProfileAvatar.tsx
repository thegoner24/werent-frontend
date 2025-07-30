import React from 'react';

interface ProfileAvatarProps {
  user: {
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-9 h-9 text-lg',
    lg: 'w-12 h-12 text-xl'
  };

  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
  
  // Use custom className if provided, otherwise use default size classes
  const avatarClasses = className || sizeClasses[size];

  if (user.profile_image) {
    return (
      <div className={`${avatarClasses} rounded-full overflow-hidden shadow`}>
        <img 
          src={user.profile_image} 
          alt={`${user.first_name} ${user.last_name}`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <span className={`${avatarClasses} rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow`}>
      {initials}
    </span>
  );
};

export default ProfileAvatar;
