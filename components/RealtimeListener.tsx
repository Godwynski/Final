"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

// Create client once outside component to avoid recreation on every render
const supabase = createClient();

export default function RealtimeListener() {
  const router = useRouter();
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cases",
        },
        (payload) => {
          // Debounce router.refresh to avoid excessive refreshes
          if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
          }
          
          refreshTimeoutRef.current = setTimeout(() => {
            router.refresh();
            if (payload.eventType === "INSERT") {
              toast.info("New case added! Dashboard updated.");
            }
          }, 500); // Wait 500ms before refreshing
        },
      )
      .subscribe();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [router]); // Removed supabase from deps since it's now constant

  return null;
}
