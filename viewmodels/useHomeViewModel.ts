"use client";

import { useState, useEffect } from "react";

export function useHomeViewModel() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Signal that the home page has mounted and is ready for animations
    setIsLoaded(true);
  }, []);

  return { isLoaded };
}
