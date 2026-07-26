import { type ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageWrapperProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
}

export default function PageWrapper({
  children,
  showNavbar = true,
  showFooter = true,
  className = "",
}: PageWrapperProps) {
  return (
    <>
      {showNavbar && <Navbar />}
      <main className={`flex-1 ${showNavbar ? "pt-20" : ""} ${className}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  );
}
