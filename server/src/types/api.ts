export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const ok = <T>(data: T): { success: true; data: T } => ({
  success: true,
  data,
});

export const fail = (error: string): { success: false; error: string } => ({
  success: false,
  error,
});
