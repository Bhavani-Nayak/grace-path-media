"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function BlurText({ text, className = "", delay = 0 }: BlurTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="mr-[0.3em] inline-block"
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            isVisible
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [50, -5, 0],
                }
              : {}
          }
          transition={{
            duration: 0.7,
            ease: "easeOut",
            delay: delay + i * 0.1,
            times: [0, 0.5, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
