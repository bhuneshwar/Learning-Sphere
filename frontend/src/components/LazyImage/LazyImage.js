import React, { useState, useRef, useEffect } from 'react';
import './LazyImage.css';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/default-course-image.jpg',
  fallback = '/default-course-image.jpg',
  loading = 'lazy'
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    let observer;
    
    if (imgRef.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !imageLoaded && !imageError) {
              setImageSrc(src);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );
      
      observer.observe(imgRef.current);
    } else {
      // Fallback for browsers without IntersectionObserver
      setImageSrc(src);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, imageLoaded, imageError]);

  const handleLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleError = () => {
    setImageError(true);
    setImageSrc(fallback);
  };

  return (
    <div className={`lazy-image-container ${className}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`lazy-image ${imageLoaded ? 'loaded' : 'loading'} ${imageError ? 'error' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
      />
      {!imageLoaded && !imageError && (
        <div className="image-placeholder">
          <div className="loading-spinner-small"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
