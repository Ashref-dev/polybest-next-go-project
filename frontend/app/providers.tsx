"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        errorRetryCount: 3,
        dedupingInterval: 10000,
      }}
    >
      {children}
    </SWRConfig>
  );
} 