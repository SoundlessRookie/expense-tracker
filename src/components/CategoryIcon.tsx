import React from 'react';
import { motion } from 'motion/react';

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-base',
  md: 'w-10 h-10 text-lg',
  lg: 'w-12 h-12 text-xl'
};

export function CategoryIcon({ icon, color, size = 'md', animated = true, className = '' }: CategoryIconProps) {
  const IconWrapper = animated ? motion.div : 'div';
  
  return (
    <IconWrapper
      className={`
        ${sizeMap[size]} 
        rounded-xl flex items-center justify-center
        transition-all duration-300
        ${className}
      `}
      style={{ 
        backgroundColor: `${color}20`, // 20% 透明度版本
        color: color 
      }}
      whileHover={animated ? { 
        scale: 1.1, 
        rotate: 5,
        backgroundColor: color,
        color: 'white',
        transition: { type: 'spring', stiffness: 300 }
      } : undefined}
      whileTap={animated ? { scale: 0.9 } : undefined}
    >
      <span className="select-none">{icon}</span>
    </IconWrapper>
  );
}