import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase";
import { Activity, CreateActivity, UpdateActivity } from "@/shared/activity.schema";

export function useActivities(date: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ Track logged-in user
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null);
    });
  }, []);

  // ✅ Fetch activities
  const fetchActivities = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      const q = query(
        collection(db, "activities"),
        where("user_id", "==", userId),
        where("activity_date", "==", date)
      );

      const snapshot = await getDocs(q);

      const list: Activity[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id, // ✅ string ID
        ...(docSnap.data() as Omit<Activity, "id">),
      }));

      setActivities(list);

      const total = list.reduce(
        (sum, a) => sum + a.duration_minutes,
        0
      );
      setTotalMinutes(total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activities");
    } finally {
      setIsLoading(false);
    }
  }, [date, userId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // ✅ Create
  const createActivity = async (data: CreateActivity) => {
    if (!userId) throw new Error("Not authenticated");

    await addDoc(collection(db, "activities"), {
      ...data,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await fetchActivities();
  };

  // ✅ Update
  const updateActivity = async (id: string, data: UpdateActivity) => {
    await updateDoc(doc(db, "activities", id), {
      ...data,
      updated_at: new Date().toISOString(),
    });

    await fetchActivities();
  };

  // ✅ Delete
  const deleteActivity = async (id: string) => {
    await deleteDoc(doc(db, "activities", id));
    await fetchActivities();
  };

  return {
    activities,
    totalMinutes,
    remainingMinutes: 1440 - totalMinutes,
    isLoading,
    error,
    refresh: fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
  };
}
