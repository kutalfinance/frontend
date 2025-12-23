import z from "zod";

/**
 * The phone regex supports common international formats like:
 * - +1 (555) 123-4567
 * - +44 20 7123 4567
 * - 555-123-4567
 * - (555) 123 4567
 * */
const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;

export const customerDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Please enter a valid phone number (numbers, spaces, +, -, (), allowed)"),
  email: z.email("Please enter a valid email address"),
  location: z.string().min(1, "Location is required"),
  contributionAmount: z.coerce.number<number>().min(0, "Contribution amount cannot be negative"),
  branchId: z.string().min(1, "Branch selection is required"),
});

export const nextOfKinSchema = z.object({
  name: z.string().min(1, "Next of kin name is required"),
  phoneNumber: z
    .string()
    .min(1, "Next of kin phone number is required")
    .regex(phoneRegex, "Please enter a valid phone number (numbers, spaces, +, -, (), allowed)"),
  email: z.email("Please enter a valid next of kin email address"),
});
