"use client";

import { useEffect } from "react";

function targetsProtectedMedia(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("[data-protected-media], img, video"));
}

export function PhotoProtection() {
  useEffect(() => {
    function preventMediaAction(event: Event) {
      if (targetsProtectedMedia(event.target)) event.preventDefault();
    }

    document.addEventListener("contextmenu", preventMediaAction, true);
    document.addEventListener("dragstart", preventMediaAction, true);

    return () => {
      document.removeEventListener("contextmenu", preventMediaAction, true);
      document.removeEventListener("dragstart", preventMediaAction, true);
    };
  }, []);

  return null;
}
