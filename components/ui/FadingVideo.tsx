"use client";

import { useRef, useEffect, useCallback } from "react";

interface FadingVideoProps {
  sources: string[];
  className?: string;
}

const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55; // seconds before end to begin fade-out

export default function FadingVideo({ sources, className = "" }: FadingVideoProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const activeIndex = useRef(0);
  const hasFadedOut = useRef<boolean[]>(sources.map(() => false));

  const fadeTo = useCallback(
    (el: HTMLVideoElement, target: number, duration: number) => {
      // Cancel any previous animation
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }

      const start = parseFloat(el.style.opacity || "0");
      const startTime = performance.now();

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOut cubic
        el.style.opacity = String(start + (target - start) * eased);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          animFrameRef.current = null;
        }
      }

      animFrameRef.current = requestAnimationFrame(step);
    },
    []
  );

  const handleLoadedData = useCallback(
    (index: number) => {
      const video = videoRefs.current[index];
      if (!video) return;
      video.style.opacity = "0";
      video.play().then(() => {
        fadeTo(video, 1, FADE_MS);
      }).catch(() => {
        // Autoplay blocked — silently fail
      });
    },
    [fadeTo]
  );

  const handleTimeUpdate = useCallback(
    (index: number) => {
      const video = videoRefs.current[index];
      if (!video || !video.duration) return;

      const remaining = video.duration - video.currentTime;
      if (remaining <= FADE_OUT_LEAD && !hasFadedOut.current[index]) {
        hasFadedOut.current[index] = true;
        fadeTo(video, 0, FADE_MS);
      }
    },
    [fadeTo]
  );

  const handleEnded = useCallback(
    (index: number) => {
      const video = videoRefs.current[index];
      if (!video) return;

      video.style.opacity = "0";
      hasFadedOut.current[index] = false;

      // Move to next video (or loop back to first)
      const nextIndex = (index + 1) % sources.length;
      activeIndex.current = nextIndex;

      setTimeout(() => {
        const nextVideo = videoRefs.current[nextIndex];
        if (!nextVideo) return;
        nextVideo.currentTime = 0;
        nextVideo.play().then(() => {
          fadeTo(nextVideo, 1, FADE_MS);
        }).catch(() => {});
      }, 100);
    },
    [sources.length, fadeTo]
  );

  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      {sources.map((src, index) => (
        <video
          key={src}
          ref={(el) => { videoRefs.current[index] = el; }}
          src={src}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-top"
          style={{ opacity: 0 }}
          onLoadedData={() => handleLoadedData(index)}
          onTimeUpdate={() => handleTimeUpdate(index)}
          onEnded={() => handleEnded(index)}
        />
      ))}
    </div>
  );
}
