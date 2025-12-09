import { z } from "zod";

export const ActivitySchema = z.object({
  id: z.string(), // ✅ Firestore uses string IDs
  userId: z.string(),
  activity_name: z.string().min(1),
  category: z.string().min(1),
  duration_minutes: z.number().int().min(1).max(1440),
  date: z.string(),
  createdAt: z.number(),
});

export type Activity = z.infer<typeof ActivitySchema>;

export const CreateActivitySchema = z.object({
  activity_name: z.string().min(1),
  category: z.string().min(1),
  duration_minutes: z.number().int().min(1).max(1440),
  date: z.string(),
});

export interface CreateActivity {
  activity_name: string;
  category: string;
  duration_minutes: number;
  activity_date: string; // ✅ FIXED
}

export const UpdateActivitySchema = CreateActivitySchema.partial();

export type UpdateActivity = z.infer<typeof UpdateActivitySchema>;
