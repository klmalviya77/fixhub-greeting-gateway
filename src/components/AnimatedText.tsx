
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

const AnimatedText = ({ 
  text, 
  className, 
  delay = 0,
  element: Element = 'span'
}: AnimatedTextProps) => {
  // Use a more generic HTMLDivElement type that's compatible with all elements
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (textRef.current) {
              textRef.current.style.opacity = '1';
              textRef.current.style.transform = 'translateY(0)';
            }
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (textRef.current) {
      observer.observe(textRef.current);
    }
    
    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, [delay]);
  
  return (
    <Element
      ref={textRef as React.RefObject<any>}
      className={cn(
        'opacity-0 transform translate-y-4 transition-all duration-700 ease-apple',
        className
      )}
    >
      {text}
    </Element>
  );
};

export default AnimatedText;
