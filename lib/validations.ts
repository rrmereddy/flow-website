import { z } from "zod";

export const waitlistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["rider", "driver"], {
    required_error: "Please select if you are a rider or driver",
  }),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;
