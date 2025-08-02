"use client";

import { UserProvider } from "./useContext";


export function Providers({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
