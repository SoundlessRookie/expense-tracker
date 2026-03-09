import React from 'react';
import { motion } from 'motion/react';

interface BlobMascotProps {
  size?: number;
  isSad?: boolean;
  animate?: boolean;
}

/**
 * Cute Blob Mascot Logo
 * Can switch between happy and sad states
 */
export function BlobMascot({ size = 48, isSad = false, animate = true }: BlobMascotProps) {
  const scale = size / 160;
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 160 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      {animate ? (
        <motion.path
          d="M80 20C40 20 20 50 20 90C20 130 50 140 80 140C110 140 140 130 140 90C140 50 120 20 80 20Z"
          fill={isSad ? "#E2E8F0" : "#FFD6A5"}
          animate={{ 
            d: isSad 
              ? "M80 30C45 30 25 55 25 90C25 125 55 135 80 135C105 135 135 125 135 90C135 55 115 30 80 30Z"
              : "M80 20C40 20 20 50 20 90C20 130 50 140 80 140C110 140 140 130 140 90C140 50 120 20 80 20Z"
          }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        <path
          d={isSad 
            ? "M80 30C45 30 25 55 25 90C25 125 55 135 80 135C105 135 135 125 135 90C135 55 115 30 80 30Z"
            : "M80 20C40 20 20 50 20 90C20 130 50 140 80 140C110 140 140 130 140 90C140 50 120 20 80 20Z"
          }
          fill={isSad ? "#E2E8F0" : "#FFD6A5"}
        />
      )}
      
      {/* Eyes */}
      <circle cx="55" cy="80" r="6" fill="#4A5568" />
      <circle cx="105" cy="80" r="6" fill="#4A5568" />
      
      {/* Mouth */}
      {animate ? (
        <motion.path
          d={isSad ? "M65 110Q80 100 95 110" : "M65 105Q80 115 95 105"}
          stroke="#4A5568"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d={isSad ? "M65 110Q80 100 95 110" : "M65 105Q80 115 95 105"}
          stroke="#4A5568"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      )}
      
      {/* Blush */}
      {!isSad && (
        <>
          <circle cx="40" cy="95" r="8" fill="#FFADAD" fillOpacity="0.4" />
          <circle cx="120" cy="95" r="8" fill="#FFADAD" fillOpacity="0.4" />
        </>
      )}
    </svg>
  );
}

/**
 * Logo
 */
export function BlobLogo({ size = 48 }: { size?: number }) {
  return <BlobMascot size={size} isSad={false} animate={false} />;
}

/**
 * switch between happy and sad Blob Mascot based on balance
 */
export function SmartBlobMascot({ 
  size = 48, 
  balance = 0,
  animate = true 
}: { 
  size?: number; 
  balance?: number;
  animate?: boolean;
}) {
  // balance < 0 sad face, otherwise happy face
  const isSad = balance < 0;
  
  return <BlobMascot size={size} isSad={isSad} animate={animate} />;
}