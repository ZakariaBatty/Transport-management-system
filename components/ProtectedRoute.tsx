"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useSession();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      setIsReady(true);
    }
  }, [status, router]);

  if (status === "loading" || !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
