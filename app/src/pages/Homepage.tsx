
import { useEffect } from "react";
import Navbar from "@/components/Homepage/Navbar";
import HeroSection from "@/components/Homepage/HeroSection";
import FeaturesSection from "@/components/Homepage/FeaturesSection";
import PrivacySection from "@/components/Homepage/PrivacySection";
import FutureSection from "@/components/Homepage/FutureSection";
import Footer from "@/components/Homepage/Footer";

const Index = () => {
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <PrivacySection />
        <FutureSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;