
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { InteractionMetric } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InteractionChartProps {
  data: InteractionMetric[];
}

export const InteractionChart = ({ data }: InteractionChartProps) => {
  return (
    <Card className="h-[350px]">
      <CardHeader>
        <CardTitle className="text-lg">Interaction Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                background: "var(--background)",
                border: "1px solid var(--border)",
              }}
            />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
