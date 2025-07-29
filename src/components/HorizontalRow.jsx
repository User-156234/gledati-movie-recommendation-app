import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SeriesCard from './SeriesCard';

const HorizontalRow = ({ title, items }) => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setShowLeft(el.scrollLeft > 0);
      setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <div className="section-row">
      <h2 className="section-title">{title}</h2>

      <div className="horizontal-scroll-wrapper">
        {showLeft && (
          <button className="scroll-arrow left" onClick={() => scroll('left')}>
            <FaChevronLeft />
          </button>
        )}

        <div className="scroll-container" ref={scrollRef}>
          {items.map((tv) => (
            <div key={tv.id} className="scroll-item">
              <SeriesCard movie={tv} />
            </div>
          ))}
        </div>

        {showRight && (
          <button className="scroll-arrow right" onClick={() => scroll('right')}>
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default HorizontalRow;
