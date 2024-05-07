import React, { useRef, useEffect, useState } from 'react';

function LazyImage({ src, alt, externalClass }) {
  const imageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const config = {
    rootMargin: '50px 0px',
    threshold: 0.01
  };

  useEffect(() => {
    let observer;
    if (imageRef.current) {
      observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      }, config);
      observer.observe(imageRef.current);
    }
    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [imageRef, config]);

  return (
    <img
      ref={imageRef}
      src={isVisible ? src : null}
      alt={alt}
      className={"lazy "+ externalClass}
    />
  );
}

export default LazyImage;
