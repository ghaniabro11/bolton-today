import AppSidebar from "@/components/SidebarLayout/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | News Backend",
  description: "",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={`

        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar]:h-1.5!
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:cursor-point
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
      `}
      suppressHydrationWarning
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="p-4">
          <SidebarTrigger />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
