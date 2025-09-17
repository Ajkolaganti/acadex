'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  autoplay?: boolean;
  delay?: number;
  loop?: boolean;
  slidesToShow?: number;
  spaceBetween?: string;
}

export function Carousel({
  children,
  className,
  autoplay = false,
  delay = 4000,
  loop = true,
  slidesToShow = 1,
  spaceBetween = 'gap-4'
}: CarouselProps) {
  const plugins = autoplay ? [Autoplay({ delay, stopOnInteraction: false })] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align: 'start',
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: Math.min(slidesToShow, 2) },
        '(min-width: 1024px)': { slidesToScroll: slidesToShow },
      }
    },
    plugins
  );

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((embla: any) => {
    setPrevBtnDisabled(!embla.canScrollPrev());
    setNextBtnDisabled(!embla.canScrollNext());
  }, []);

  const onSelect = useCallback((embla: any) => {
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnDisabled(!embla.canScrollPrev());
    setNextBtnDisabled(!embla.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <div className={cn('relative', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={cn('flex', spaceBetween)}>
          {children.map((child, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 min-w-0"
              style={{
                flex: `0 0 ${100 / slidesToShow}%`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {child}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <motion.button
        className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 z-10',
          'glass-button p-3 rounded-full shadow-lg',
          'hover:scale-110 active:scale-95 transition-all duration-200',
          prevBtnDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
        )}
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </motion.button>

      <motion.button
        className={cn(
          'absolute right-4 top-1/2 -translate-y-1/2 z-10',
          'glass-button p-3 rounded-full shadow-lg',
          'hover:scale-110 active:scale-95 transition-all duration-200',
          nextBtnDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
        )}
        onClick={scrollNext}
        disabled={nextBtnDisabled}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </motion.button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 gap-2">
        {children.map((_, index) => (
          <motion.button
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-200',
              index === selectedIndex
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            )}
            onClick={() => scrollTo(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

export function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  );
}