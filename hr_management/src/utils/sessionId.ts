"use client";
import { useSession } from "next-auth/react";

export const useSessionId = () => {
  const { data: sessionData } = useSession();
  if (!sessionData || !sessionData.user || !sessionData.user.id) {
    return null;
  }
  return sessionData.user.id;
};