import { useState } from "react";
import { Plus } from "lucide-react";

interface ActivityFormProps {
  onSubmit: (data: {
    activity_name: string;
    category: string;
    duration_minutes: number;
    activity_date: string;
  }) => Promise<void>;
  date: string;
  remainingMinutes: number;
}

const CATEGORY_OPTIONS = [
  "Work",
  "Exercise",
  "Learning",
  "Entertainment",
  "Sleep",
  "Meals",
  "Commute",
  "Social",
  "Hobbies",
  "Other",
];

export default function ActivityForm({ onSubmit, date, remainingMinutes }: ActivityFormProps) {
  const [formData, setFormData] = useState({
    activity_name: "",
    category: "",
    duration_minutes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.activity_name.trim()) {
      setError("Activity name is required");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    const duration = parseInt(formData.duration_minutes);
    if (isNaN(duration) || duration < 1) {
      setError("Duration must be at least 1 minute");
      return;
    }

    if (duration > remainingMinutes) {
      setError(`Duration exceeds remaining minutes (${remainingMinutes}m available)`);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        activity_name: formData.activity_name.trim(),
        category: formData.category,
        duration_minutes: duration,
        activity_date: date,
      });
      setFormData({ activity_name: "", category: "", duration_minutes: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Add Activity</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Activity Name
          </label>
          <input
            type="text"
            value={formData.activity_name}
            onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Morning workout"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isSubmitting}
          >
            <option value="">Select a category</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., 60"
            min="1"
            max={remainingMinutes}
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          {isSubmitting ? "Adding..." : "Add Activity"}
        </button>
      </div>
    </form>
  );
}
