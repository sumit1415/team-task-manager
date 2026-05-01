import { Providers } from "@/components/providers";
import Sidebar from "@/components/shared/sidebar";
import Header from "@/components/shared/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex h-screen overflow-hidden bg-muted/40">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
