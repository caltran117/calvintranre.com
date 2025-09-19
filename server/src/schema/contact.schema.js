import { z } from "zod";

export const createContactSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .trim(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .max(20, "Phone number must be less than 20 characters")
    .trim()
    .optional(),
  interest: z
    .enum(["buying", "selling", "renting", "investing", "other"])
    .optional(),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters")
    .trim(),
  subscribeNewsletter: z
    .boolean()
    .optional()
    .default(false)
});

export const updateContactStatusSchema = z.object({
  status: z
    .enum(["new", "read", "replied", "closed"])
    .optional(),
  adminNotes: z
    .string()
    .max(500, "Admin notes must be less than 500 characters")
    .trim()
    .optional(),
  isActive: z
    .boolean()
    .optional()
});

export const getContactsQuerySchema = z.object({
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
  status: z
    .enum(["new", "read", "replied", "closed"])
    .optional(),
  interest: z
    .enum(["buying", "selling", "renting", "investing", "other"])
    .optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  search: z
    .string()
    .trim()
    .optional()
});