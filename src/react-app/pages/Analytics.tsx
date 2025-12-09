import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Clock, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Header from "@/react-app/components/Header";
import EmptyState from "@/react-app/components/EmptyState";
import { useAnalytics } from "@/react-app/hooks/useAnalytics";

const COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
  "#14b8a6", // teal
  "#f97316", // orange
  "#a855f7", // violet
];

export default function Analytics() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { analytics, isLoading, error } = useAnalytics(date || format(new Date(), "yyyy-MM-dd"));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin">
            <Clock className="w-12 h-12 text-indigo-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const hasData = analytics && analytics.totalActivities > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-all duration-200 border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600">
              {date ? format(parseISO(date), "EEEE, MMMM d, yyyy") : "Today"}
            </p>
          </div>
        </div>

        {!hasData ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <EmptyState />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-indigo-100">Total Time</span>
                  <Clock className="w-6 h-6 text-indigo-200" />
                </div>
                <div className="text-4xl font-bold mb-1">{analytics.totalHours.toFixed(1)}h</div>
                <div className="text-sm text-indigo-100">
                  {(analytics.totalHours / 24 * 100).toFixed(1)}% of your day
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-100">Activities</span>
                  <TrendingUp className="w-6 h-6 text-emerald-200" />
                </div>
                <div className="text-4xl font-bold mb-1">{analytics.totalActivities}</div>
                <div className="text-sm text-emerald-100">tracked activities</div>
              </div>

              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-pink-100">Categories</span>
                  <PieChartIcon className="w-6 h-6 text-pink-200" />
                </div>
                <div className="text-4xl font-bold mb-1">{analytics.categoryBreakdown.length}</div>
                <div className="text-sm text-pink-100">unique categories</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Pie Chart */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Category Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.categoryBreakdown}
                      dataKey="percentage"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry: any) => `${entry.category} (${entry.percentage.toFixed(1)}%)`}
                      labelLine={false}
                    >
                      {analytics.categoryBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Time by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.categoryBreakdown}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)} hours`} />
                    <Bar dataKey="hours" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Detailed Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Category</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Hours</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Minutes</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.categoryBreakdown.map((cat, index) => (
                      <tr key={cat.category} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium text-slate-900">{cat.category}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-slate-700">{cat.hours.toFixed(1)}h</td>
                        <td className="text-right py-3 px-4 text-slate-700">{cat.minutes}m</td>
                        <td className="text-right py-3 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                            {cat.percentage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Activity Timeline</h2>
              <div className="space-y-3">
                {analytics.activities.map((activity) => {
                  const hours = Math.floor(activity.duration_minutes / 60);
                  const minutes = activity.duration_minutes % 60;
                  const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{activity.activity_name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                            {activity.category}
                          </span>
                          <span className="text-sm text-slate-500">
                            {format(parseISO(activity.created_at), "h:mm a")}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-indigo-600">{timeDisplay}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
