
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InsightItem } from "@/components/dashboard/InsightItem";
import { mockInsights } from "@/data/mockData";
import { useState } from "react";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Insights = () => {
  const [insights, setInsights] = useState(mockInsights);
  const [filter, setFilter] = useState<string>("all");

  const markAsRead = (id: string) => {
    setInsights(
      insights.map((insight) =>
        insight.id === id ? { ...insight, isRead: true } : insight
      )
    );
  };

  const filteredInsights = filter === "all" 
    ? insights 
    : filter === "unread" 
      ? insights.filter(insight => !insight.isRead)
      : insights.filter(insight => insight.type === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Insights & Suggestions</h2>
          <p className="text-muted-foreground">
            Personalized insights to help strengthen your network
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter insights" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Insights</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
              <SelectItem value="contact">Contact Insights</SelectItem>
              <SelectItem value="network">Network Insights</SelectItem>
              <SelectItem value="opportunity">Opportunities</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Important Highlights</CardTitle>
            <CardDescription>
              Recent insights that require your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInsights.filter(i => i.priority === "high").length > 0 ? (
                filteredInsights
                  .filter(i => i.priority === "high")
                  .map(insight => (
                    <InsightItem 
                      key={insight.id} 
                      insight={insight} 
                      onMarkAsRead={markAsRead}
                    />
                  ))
              ) : (
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No high priority insights</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">All Insights</h3>
        
        <div className="space-y-4">
          {filteredInsights.length > 0 ? (
            filteredInsights.map(insight => (
              <InsightItem 
                key={insight.id} 
                insight={insight} 
                onMarkAsRead={markAsRead}
              />
            ))
          ) : (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No insights found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
