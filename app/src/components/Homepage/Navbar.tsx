import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-conlieve-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Conlieve</span>
            </Link>
            <Button
              variant="outline"
              className="hidden md:block border-conlieve-primary text-conlieve-primary cursor-default ml-3"
            >
              Beta Access v1.0
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button
                variant="outline"
                className="border-conlieve-primary text-conlieve-primary hover:bg-conlieve-primary hover:text-white transition-colors"
              >
                Log in
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-conlieve-primary hover:bg-conlieve-primary/90 text-white">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
