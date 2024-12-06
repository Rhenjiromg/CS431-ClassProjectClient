import React, { useState, useImperativeHandle, forwardRef } from 'react';
import './Carousel.css'; 

const Carousel = forwardRef(({ children }, ref) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = React.Children.count(children);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  useImperativeHandle(ref, () => ({
    nextSlide,
    prevSlide,
  }));

  return (
    <div className="carousel-container">
      <div
        className="carousel-slides"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {React.Children.map(children, (child) => (
          <div className="carousel-slide">{child}</div>
        ))}
      </div>
    </div>
  );
});

export default Carousel;
