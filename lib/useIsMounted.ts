"use client";

import { useEffect, useState } from "react";

/** True after the component has hydrated in the browser. */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
