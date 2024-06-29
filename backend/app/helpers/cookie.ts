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
    maxAge: 60 * 60 * 1000, // 1 hour
  } as CookieOptions;

  const cookieOptions: CookieOptions = { ...defaultOptions, ...options };

  res.cookie(name, value, cookieOptions);
};
