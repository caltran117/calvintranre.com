import { z } from "zod";

export const subscribeNewsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .toLowerCase()
    .trim(),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "Consent is required to subscribe to newsletter"
    })
});

export const unsubscribeNewsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .toLowerCase()
    .trim()
});

export const updateNewsletterSchema = z.object({
  consent: z
    .boolean()
    .optional(),
  isSubscribed: z
    .boolean()
    .optional()
}).refine((data) => {
  
  if (data.isSubscribed === true && data.consent === false) {
    return false;
  }
  return true;
}, {
  message: "Consent is required when subscribing to newsletter"
});

// Admin newsletter management schema
export const adminUpdateNewsletterSchema = z.object({
  consent: z
    .boolean()
    .optional(),
  isSubscribed: z
    .boolean()
    .optional(),
  numberOfEmails: z
    .number()
    .min(0, "Number of emails cannot be negative")
    .optional()
});

export const getNewsletterSubscribersSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, "Page must be greater than 0")
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100")
    .default("10"),
  isSubscribed: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  consent: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  sortBy: z
    .enum(["subscribedAt", "email", "numberOfEmails", "createdAt"])
    .default("subscribedAt"),
  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc")
});

export const sendBulkEmailSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be less than 200 characters"),
  content: z
    .string()
    .min(1, "Email content is required"),
  onlySubscribed: z
    .boolean()
    .default(true),
  onlyConsented: z
    .boolean()
    .default(true)
});
