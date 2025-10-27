import React from "react";
import RecentNews from "./layout-right-section";
import AdBanner from "../AdBanner";

interface PageGridWrapperProps {
  children: React.ReactNode;
}

const PageGridWrapper: React.FC<PageGridWrapperProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-12 gap-4 pt-5">
      {/* Main Content (centered children) */}
      <div
        className="lg:col-span-8 col-span-12 flex justify-center"
        suppressHydrationWarning
      >
        <div className="w-full max-w-3xl">{children}</div>
      </div>

      {/* Desktop Aside */}
      <div className="lg:col-span-4  col-span-12">
        <RecentNews />
        <AdBanner />
      </div>
    </div>
  );
};

export default PageGridWrapper;
