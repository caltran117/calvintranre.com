import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .toLowerCase()
    .trim(),
  role: z
    .enum(["admin"])
    .optional(),
  password: z
    .string()
    .min(1, "Password is required when signing in as admin")
    .optional()
}).refine((data) => {
  if (data.role === "admin" && !data.password) {
    return false;
  }
  
  if (data.password && data.role !== "admin") {
    return false;
  }
  return true;
}, {
  message: "Password is required when role is admin, and role must be admin when password is provided"
});

export const updateUserSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim()
    .optional(),
  role: z
    .enum(["user", "admin"])
    .optional(),
  isActive: z
    .boolean()
    .optional(),
  favProperty: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"))
    .optional()
});

// Admin-only user management schema
export const adminUpdateUserSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim()
    .optional(),
  role: z
    .enum(["user", "admin"])
    .optional(),
  isActive: z
    .boolean()
    .optional()
});

export const addFavoritePropertySchema = z.object({
  propertyId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid property ID format")
});

export const removeFavoritePropertySchema = z.object({
  propertyId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid property ID format")
});

export const getUsersQuerySchema = z.object({
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
  role: z
    .enum(["user", "admin"])
    .optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional()
});
