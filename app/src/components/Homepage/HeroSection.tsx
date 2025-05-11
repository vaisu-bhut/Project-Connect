
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 bg-grid">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Your Ultimate <span className="gradient-text">Network Management</span> Companion
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 max-w-xl"
            >
              Organize, nurture, and leverage your professional and personal connections with a privacy-focused approach.
            </motion.p>
          </div>
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative z-10"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-conlieve-primary/10 p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 text-sm font-medium text-gray-700">Conlieve Dashboard</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-conlieve-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Total Contacts</div>
                      <div className="text-2xl font-bold text-gray-900">248</div>
                      <div className="text-xs text-green-600 mt-2">↑ 12% this month</div>
                    </div>
                    <div className="bg-conlieve-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Recent Interactions</div>
                      <div className="text-2xl font-bold text-gray-900">36</div>
                      <div className="text-xs text-gray-500 mt-2">Last 7 days</div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium mr-3">JD</div>
                      <div>
                        <div className="font-medium">John Doe</div>
                        <div className="text-xs text-gray-500">Product Manager at Tech Co</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Last contact: Coffee meeting (3 days ago)
                    </div>
                  </div>
                  <div className="bg-conlieve-secondary/20 rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">Follow-up Reminder</div>
                    <div className="text-xs text-gray-600">
                      It's been 2 weeks since you last contacted Sarah Johnson about the partnership proposal.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-conlieve-secondary/30 rounded-full blur-3xl z-0"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-accent/30 rounded-full blur-3xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;