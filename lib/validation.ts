import z from "zod";

export const SigninWithOAuthSchema = z.object({
  provider: z.enum(["github", "google"]),
  providerAccountId: z.string().min(1, { message: "Provider Account Required" }),
  user: z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .transform((value) => value.trim().toLowerCase()),
    image: z.url("Invalid image URL").optional(),
  }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .email({ message: "Please provide a valid email address." })
    .min(1, { message: "Email is required." })
    .transform((value) => value.trim().toLowerCase()),

  //we can make password strong later in production
  password: z.string(),
});

export const SignInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address." })
    .min(1, { message: "Email is required." })
    .transform((value) => value.trim().toLowerCase()),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const AdminFormschema = z.object({
  email: z.email().min(1,{message: "Email is Required"}).transform((value)=>value.trim().toLowerCase()),
  password: z.string().min(6,"password must be 6 character long"),
  image: z.string().optional(),
  username: z.string().min(1,{message: "username is Required"}),
  name: z.string().min(1,{message:" name is Required"})
})

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const TrainerSchema = z.object({
  email: z.email().min(1,{message: "Email is required"}),
  username: z.string().min(5,{message: "min 5 length username is required"}),
  specialization: z.string().optional(),
  phone: z.string().optional(),
  experience: z.string().optional(),
  image: z.string().optional(),
  password: z.string()
})

