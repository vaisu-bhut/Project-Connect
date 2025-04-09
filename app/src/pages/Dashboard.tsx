
import { 
  Users, 
  UserCheck, 
  ActivitySquare, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { InsightItem } from "@/components/dashboard/InsightItem";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { InteractionChart } from "@/components/dashboard/InteractionChart";
import { mockNetworkOverview, mockInsights } from "@/data/mockData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [insights, setInsights] = useState(mockInsights);
  const navigate = useNavigate();

  const markAsRead = (id: string) => {
    setInsights(
      insights.map((insight) =>
        insight.id === id ? { ...insight, isRead: true } : insight
      )
    );
  };

  const unreadInsights = insights.filter((insight) => !insight.isRead);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contacts"
          value={mockNetworkOverview.totalContacts}
          icon={<Users className="h-4 w-4" />}
          description="in your network"
        />
        <StatCard
          title="Active Contacts"
          value={mockNetworkOverview.activeContacts}
          icon={<UserCheck className="h-4 w-4" />}
          description="contacted in last 30 days"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Avg. Connection Strength"
          value={mockNetworkOverview.averageConnectionStrength.toFixed(1)}
          icon={<ActivitySquare className="h-4 w-4" />}
          description="out of 100"
        />
        <StatCard
          title="Need Attention"
          value={mockNetworkOverview.needAttention}
          icon={<AlertCircle className="h-4 w-4" />}
          description="connections weakening"
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CategoryChart data={mockNetworkOverview.categoryDistribution} />
        <InteractionChart data={mockNetworkOverview.interactionMetrics} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Insights & Suggestions</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/insights")}>
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {unreadInsights.length === 0 ? (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No new insights</p>
            </div>
          ) : (
            unreadInsights.map((insight) => (
              <InsightItem 
                key={insight.id} 
                insight={insight} 
                onMarkAsRead={markAsRead}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
