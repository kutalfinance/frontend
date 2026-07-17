import z from "zod";

// Matches local (0XXXXXXXXX) and international (+233XXXXXXXXX) Ghanaian mobile numbers
// Valid operator prefixes: 020 023 024 025 026 027 028 050 053 054 055 056 057 059
const ghanaPhoneRegex = /^(0|\+233)(20|23|24|25|26|27|28|50|53|54|55|56|57|59)\d{7}$/;
const ghanaPhoneMessage = "Enter a valid Ghanaian phone number (e.g. 0241234567 or +233241234567)";

export const customerDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(ghanaPhoneRegex, ghanaPhoneMessage)
    .optional(),
  email: z.union([z.email("Please enter a valid email address"), z.literal("")]).optional(),
  location: z.string().min(1, "Location is required"),
  contributionAmount: z.coerce.number<number>().min(1, "Contribution amount must be at least 1"),
  branchId: z.string().min(1, "Branch selection is required"),
});

export const nextOfKinSchema = z.object({
  name: z.string().min(1, "Next of kin name is required"),
  phoneNumber: z
    .string()
    .min(1, "Next of kin phone number is required")
    .regex(ghanaPhoneRegex, ghanaPhoneMessage),
  email: z
    .union([z.email("Please enter a valid next of kin email address"), z.literal("")])
    .optional(),
});
