import { z } from "zod";

export const UserRoleSchema = z.enum(["admin", "editor", "viewer"]);
export const UserStatusSchema = z.enum(["active", "inactive", "pending"]);

/** 서버 응답 한 행의 런타임 스키마이자 프론트 타입의 근거 */
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  score: z.number().int().min(0).max(100),
  joinedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/** GET /api/users 성공 JSON */
export const UsersApiResponseSchema = z.object({
  ok: z.literal(true),
  data: z.array(UserSchema),
  meta: z.object({
    total: z.number().int().nonnegative(),
    count: z.number().int().nonnegative(),
    seed: z.number().int(),
    generatedAt: z.string().datetime(),
  }),
});

/** GET /api/users 실패 JSON */
export const UsersApiErrorSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type User = z.infer<typeof UserSchema>;
export type UsersApiResponse = z.infer<typeof UsersApiResponseSchema>;
export type UsersApiError = z.infer<typeof UsersApiErrorSchema>;
