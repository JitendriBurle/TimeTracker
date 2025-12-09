import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

import Header from "../components/Header";
import ActivityForm from "../components/ActivityForm";
import ActivityCard from "../components/ActivityCard";
import { useActivities } from "../hooks/useActivities";
import { auth } from "../../firebase";

// ✅ ✅ ✅ CORRECT SINGLE SOURCE OF TRUTH
import type { Activity } from "@/shared/activity.schema";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const navigate = useNavigate();

  // ✅ Protect dashboard with Firebase auth


  const {
    activities,
    totalMinutes,
    remainingMinutes,
    isLoading,
    error,
    createActivity,
    updateActivity,
    deleteActivity,
  } = useActivities(selectedDate);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;

  const canAnalyze = totalMinutes >= 1;

  const handleAnalyze = () => {
    navigate(`/analytics/${selectedDate}`);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* ✅ Logout */}
      <div className="flex justify-end max-w-7xl mx-auto px-4 pt-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ Date Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Select Date
                </h2>
                <p className="text-sm text-slate-600">
                  Track activities for any day
                </p>
              </div>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* ✅ Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <span className="text-indigo-100">Total Logged</span>
            <div className="text-3xl font-bold mt-2">
              {totalHours}h {totalMinutes % 60}m
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
            <span className="text-emerald-100">Remaining</span>
            <div className="text-3xl font-bold mt-2">
              {remainingHours}h {remainingMins}m
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white shadow-lg">
            <span className="text-pink-100">Activities</span>
            <div className="text-3xl font-bold mt-2">
              {activities.length}
            </div>
          </div>
        </div>

        {/* ✅ Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ✅ Activity Form */}
          <div className="lg:col-span-1">
            <ActivityForm
              onSubmit={createActivity}
              date={selectedDate}
              remainingMinutes={remainingMinutes}
            />
          </div>

          {/* ✅ Activity List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Activities</h2>

                {canAnalyze && (
                  <button
                    onClick={handleAnalyze}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-md flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Analyze
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin">
                    <Clock className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
              ) : activities.length === 0 ? (
                <p className="text-center text-slate-600 py-12">
                  No activities yet
                </p>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onEdit={updateActivity}
                      onDelete={deleteActivity}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
