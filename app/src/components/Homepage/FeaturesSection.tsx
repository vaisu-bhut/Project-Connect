
import { Network, Users, MessageSquare, Clock } from "lucide-react";

const features = [
  {
    title: "Dashboard",
    description: "Get a comprehensive view of your network with actionable insights, growth trends, and visual analytics.",
    icon: <Network className="w-6 h-6" />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Contacts",
    description: "Build rich, searchable profiles with professional and personal details for everyone in your network.",
    icon: <Users className="w-6 h-6" />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Interactions",
    description: "Log conversations, capture key points, and keep track of your history with each contact.",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Reminders",
    description: "Stay proactive with smart, flexible reminders for follow-ups and regular check-ins.",
    icon: <Clock className="w-6 h-6" />,
    color: "bg-amber-100 text-amber-600",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-conlieve-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conlieve provides powerful tools to help you manage and enhance your network effectively
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm p-6 transition-transform hover:-translate-y-1 duration-300"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;