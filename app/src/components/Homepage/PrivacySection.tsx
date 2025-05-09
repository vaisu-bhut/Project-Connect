
const PrivacySection = () => {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="card-backdrop p-8 animate-float relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-conlieve-primary/5 to-transparent rounded-2xl"></div>
                <h3 className="text-2xl font-bold mb-6">Your Data, Your Rules</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong className="font-medium">Local-first storage:</strong>
                      <p className="text-gray-600 mt-1">Your data stays on your device by default—no cloud required.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong className="font-medium">Optional cloud sync:</strong>
                      <p className="text-gray-600 mt-1">Enable encrypted backups with AES-256 encryption for cross-device access.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong className="font-medium">Zero third-party tracking:</strong>
                      <p className="text-gray-600 mt-1">No ads, no analytics, no data harvesting—ever.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong className="font-medium">Open-source commitment:</strong>
                      <p className="text-gray-600 mt-1">Our code is transparent and available for review.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Privacy and Data Security</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe your relationships are yours alone. Conlieve is built from the ground up with your privacy as the top priority.
              </p>
              <p className="text-lg text-gray-600">
                Unlike traditional CRM tools that harvest your data for their business models, Conlieve puts you in control with transparent, privacy-first design principles.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default PrivacySection;  