import { useState } from "react";
import { Pencil, Trash2, Clock } from "lucide-react";
import type { Activity } from "@/shared/activity.schema"; // ✅ FIXED IMPORT

interface ActivityCardProps {
  activity: Activity;
  onEdit: (id: string, data: Partial<Activity>) => Promise<void>; // ✅ string ID
  onDelete: (id: string) => Promise<void>; // ✅ string ID
}

export default function ActivityCard({
  activity,
  onEdit,
  onDelete,
}: ActivityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    activity_name: activity.activity_name,
    category: activity.category,
    duration_minutes: activity.duration_minutes,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    try {
      await onEdit(activity.id, editData);
      setIsEditing(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update activity");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        setIsDeleting(true);
        await onDelete(activity.id);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to delete activity");
        setIsDeleting(false);
      }
    }
  };

  const hours = Math.floor(activity.duration_minutes / 60);
  const minutes = activity.duration_minutes % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl border border-indigo-200 p-4 shadow-sm">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.activity_name}
            onChange={(e) =>
              setEditData({ ...editData, activity_name: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Activity name"
          />

          <input
            type="text"
            value={editData.category}
            onChange={(e) =>
              setEditData({ ...editData, category: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Category"
          />

          <input
            type="number"
            value={editData.duration_minutes}
            onChange={(e) =>
              setEditData({
                ...editData,
                duration_minutes: Number(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Duration (minutes)"
            min={1}
            max={1440}
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        isDeleting ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-lg">
            {activity.activity_name}
          </h3>

          <div className="flex items-center gap-4 mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
              {activity.category}
            </span>

            <span className="inline-flex items-center gap-1 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              {timeDisplay}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            disabled={isDeleting}
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
