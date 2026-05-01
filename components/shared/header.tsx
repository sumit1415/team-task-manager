"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b bg-card">
      <div className="flex-1">
        {/* Search or breadcrumbs could go here */}
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
          U
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
