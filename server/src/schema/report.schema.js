import { z } from 'zod';

export const reportQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export const propertyStatsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['For Sale', 'For Rent', 'Sold', 'Rented', 'Under Contract', 'Off Market', 'Coming Soon']).optional(),
  propertyType: z.enum(['Residential', 'Commercial', 'Land', 'Multi-Family', 'Condo', 'Townhouse']).optional(),
  city: z.string().optional()
});

export const userAnalyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  role: z.enum(['admin', 'user']).optional()
});

export const newsletterMetricsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export const locationAnalyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export const customReportSchema = z.object({
  models: z.array(z.enum(['properties', 'users', 'newsletter', 'locations'])).min(1),
  metrics: z.array(z.enum(['count', 'distribution', 'pricing', 'growth', 'activity'])).min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  filters: z.object({
    properties: z.record(z.any()).optional(),
    users: z.record(z.any()).optional(),
    newsletter: z.record(z.any()).optional(),
    locations: z.record(z.any()).optional()
  }).optional()
});

export const exportDataQuerySchema = z.object({
  model: z.enum(['properties', 'users', 'newsletter', 'locations']),
  format: z.enum(['json', 'csv']).default('json'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  filters: z.string().optional()
});

export const dashboardTrendsQuerySchema = z.object({
  period: z.enum(['month', 'week', 'day']).default('month').optional()
});

export const locationHeatmapQuerySchema = z.object({
  days: z.string().regex(/^\d+$/).transform(Number).default('7').optional()
});

export const performanceAnalyticsQuerySchema = z.object({
  period: z.enum(['30', '60', '90']).default('30').optional()
});