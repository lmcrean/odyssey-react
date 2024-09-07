import React, { createContext, useState, useContext, useEffect } from 'react';

const AnimationLoadingContext = createContext();

export const useAnimationLoading = () => useContext(AnimationLoadingContext);

export const AnimationLoadingProvider = ({ children }) => {
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    const loadImages = () => {
      const images = document.querySelectorAll('img');
      setTotalImages(images.length);

      images.forEach(img => {
        if (img.complete) {
          setImagesLoaded(prev => prev + 1);
        } else {
          img.onload = () => setImagesLoaded(prev => prev + 1);
          img.onerror = () => setImagesLoaded(prev => prev + 1); // Count errors as loaded
        }
      });
    };

    loadImages();
    
    // Recheck images every second in case new images are added dynamically
    const interval = setInterval(loadImages, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (imagesLoaded === totalImages && totalImages > 0) {
      // All images loaded, now load animations
      setTimeout(() => {
        setIsAnimationLoaded(true);
      }, 1000); // Delay to ensure smooth transition
    }
  }, [imagesLoaded, totalImages]);

  const loadingProgress = totalImages > 0 ? (imagesLoaded / totalImages) * 100 : 0;

  return (
    <AnimationLoadingContext.Provider value={{ isAnimationLoaded, loadingProgress }}>
      {children}
    </AnimationLoadingContext.Provider>
  );
};