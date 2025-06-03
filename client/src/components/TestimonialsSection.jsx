// TestimonialsSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      text: "Working with The Umansky Team was an exceptional experience. Their knowledge of the Los Angeles luxury market is unparalleled, and they guided us through every step of the process with professionalism and care.",
      author: "Sarah & Michael Johnson",
      location: "Beverly Hills"
    },
    {
      id: 2,
      text: "The Umansky Team's marketing strategy for our property was innovative and effective. They managed to secure multiple offers within days, ultimately selling our home well above asking price.",
      author: "Robert Chen",
      location: "Bel Air"
    },
    {
      id: 3,
      text: "As first-time buyers in a competitive market, we needed agents who could educate us while advocating fiercely on our behalf. The Umansky Team delivered on both counts, helping us find and secure our dream home.",
      author: "Emily & David Thompson",
      location: "Hollywood Hills"
    }
  ];

  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index) => {
    setCurrent(index);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0
    })
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-light mb-4">CLIENT TESTIMONIALS</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Hear what our clients have to say about their experience working with The Umansky Team.
          </p>
        </motion.div>

        <div className="relative h-64">
          <AnimatePresence initial={false} custom={current}>
            <motion.div
              key={testimonials[current].id}
              custom={current}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <svg className="h-8 w-8 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>
              <p className="text-gray-600 italic mb-6">{testimonials[current].text}</p>
              <div>
                <p className="font-medium text-gray-900">{testimonials[current].author}</p>
                <p className="text-gray-500 text-sm">{testimonials[current].location}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 w-2 rounded-full ${
                current === index ? 'bg-gray-900' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;