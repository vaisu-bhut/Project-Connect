
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-conlieve-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Conlieve</span>
            </Link>
            <p className="text-gray-600 max-w-md">
              Your powerful, privacy-focused companion for managing and enhancing your personal and professional networks with ease.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Conlieve. All rights reserved.
            </div>
          </div>
          

        </div>
      </div>
    </footer>
  );
};

export default Footer;