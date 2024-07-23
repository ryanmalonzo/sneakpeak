import { CookieOptions, Response } from 'express';

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {},
): void => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3d
  } as CookieOptions;

  const cookieOptions: CookieOptions = { ...defaultOptions, ...options };

  res.cookie(name, value, cookieOptions);
};
