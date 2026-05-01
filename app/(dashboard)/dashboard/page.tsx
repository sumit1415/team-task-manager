"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, ListTodo, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return res.json();
    },
    refetchInterval: 10000, // Poll every 10s
  });

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  const { stats, recentActivity } = data;

  const chartData = [
    { name: "To Do", value: stats.pendingTasks },
    { name: "Completed", value: stats.completedTasks },
    { name: "Overdue", value: stats.overdueTasks },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Tasks" value={stats.totalTasks} icon={<ListTodo className="h-4 w-4 text-muted-foreground" />} />
        <Card title="Completed" value={stats.completedTasks} icon={<CheckCircle2 className="h-4 w-4 text-primary" />} />
        <Card title="Pending" value={stats.pendingTasks} icon={<Clock className="h-4 w-4 text-orange-500" />} />
        <Card title="Overdue" value={stats.overdueTasks} icon={<AlertCircle className="h-4 w-4 text-destructive" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <div className="col-span-4 bg-card border rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Task Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-3 bg-card border rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity?.map((activity: any) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.user.name} {activity.action.toLowerCase().replace(/_/g, " ")} {activity.entityType.toLowerCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {recentActivity?.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="space-y-1">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      {icon}
    </div>
  );
}
