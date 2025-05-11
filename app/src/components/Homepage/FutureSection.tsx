const FutureSection = () => {
  return (
    <section className="py-20 bg-conlieve-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Future Enhancements
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Conlieve is constantly evolving. Here's a glimpse of what's coming
            next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/5 rounded-xl p-6">
            <div className="text-conlieve-secondary text-2xl font-bold mb-2">
              📧📞
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Automatic Interaction Logging
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Sync with email providers</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Integrate call history and calendar events</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Transcribe and summarize call recordings</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/5 rounded-xl p-6">
            <div className="text-conlieve-secondary text-2xl font-bold mb-2">
              📈
            </div>
            <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Network maps to visualize connections</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Influence scores for impactful relationships</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Predictive relationship trends</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/5 rounded-xl p-6">
            <div className="text-conlieve-secondary text-2xl font-bold mb-2">
              🧠
            </div>
            <h3 className="text-xl font-semibold mb-3">Personalized AI</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Optimal outreach timing suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Personalized conversation starters</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Dynamic relationship strength scoring</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureSection;