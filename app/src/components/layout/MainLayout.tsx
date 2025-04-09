
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  showContentHeader?: boolean;
  contentHeader?: ReactNode;
}

export const MainLayout = ({
  children,
  showContentHeader = true,
  contentHeader
}: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1">
        <main className="flex-1 p-4 md:p-6">
          {showContentHeader && (
            <div className={cn("mb-6", !contentHeader && "hidden")}>
              {contentHeader}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};
