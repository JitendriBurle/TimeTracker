import { Calendar, BarChart3 } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6 shadow-inner">
          <BarChart3 className="w-16 h-16 text-indigo-600" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-md">
          <Calendar className="w-6 h-6 text-purple-600" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        No Data Available
      </h3>
      <p className="text-slate-600 max-w-md mb-6">
        You haven't logged any activities for this date yet. Start tracking your time to see beautiful analytics and insights.
      </p>
      
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 max-w-md border border-indigo-100">
        <p className="text-sm text-slate-700">
          <span className="font-semibold text-indigo-700">Pro tip:</span> Add activities throughout your day to get the most accurate time tracking and meaningful insights.
        </p>
      </div>
    </div>
  );
}
