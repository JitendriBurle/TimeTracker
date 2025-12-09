import z from "zod";

export const ActivitySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  activity_name: z.string().min(1, "Activity name is required"),
  category: z.string().min(1, "Category is required"),
  duration_minutes: z.number().int().min(1, "Duration must be at least 1 minute").max(1440, "Duration cannot exceed 1440 minutes"),
  activity_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Activity = z.infer<typeof ActivitySchema>;

export const CreateActivitySchema = z.object({
  activity_name: z.string().min(1, "Activity name is required"),
  category: z.string().min(1, "Category is required"),
  duration_minutes: z.number().int().min(1, "Duration must be at least 1 minute").max(1440, "Duration cannot exceed 1440 minutes"),
  activity_date: z.string(),
});

export type CreateActivity = z.infer<typeof CreateActivitySchema>;

export const UpdateActivitySchema = CreateActivitySchema.partial();

export type UpdateActivity = z.infer<typeof UpdateActivitySchema>;

export const AnalyticsData = z.object({
  totalHours: z.number(),
  totalActivities: z.number(),
  categoryBreakdown: z.array(z.object({
    category: z.string(),
    minutes: z.number(),
    hours: z.number(),
    percentage: z.number(),
  })),
  activities: z.array(ActivitySchema),
});

export type Analytics = z.infer<typeof AnalyticsData>;
