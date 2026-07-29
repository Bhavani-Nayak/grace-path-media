"use client";

import { useEffect } from "react";

export default function InspectBlocker() {
  useEffect(() => {
    // 1. Disable Right Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Disable Key Shortcuts for Developer Tools & Inspecting
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 key
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      const isControlOrCmd = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;

      if (isControlOrCmd) {
        // Ctrl+Shift+I / Cmd+Option+I (Inspect element)
        // Ctrl+Shift+J / Cmd+Option+J (Console)
        // Ctrl+Shift+C / Cmd+Option+C (Inspect element selection)
        if (
          isShift &&
          (e.key === "I" ||
            e.key === "i" ||
            e.key === "J" ||
            e.key === "j" ||
            e.key === "C" ||
            e.key === "c")
        ) {
          e.preventDefault();
          return false;
        }

        // Ctrl+U / Cmd+U (View Source)
        if (e.key === "U" || e.key === "u") {
          e.preventDefault();
          return false;
        }

        // Ctrl+S / Cmd+S (Save Page)
        if (e.key === "S" || e.key === "s") {
          e.preventDefault();
          return false;
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
