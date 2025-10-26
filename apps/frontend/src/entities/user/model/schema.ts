import z from "zod";

import { env } from "@/shared/config/client";

import { getMaxBirthDate, getMinBirthDate } from "../lib/birthdate";

export const UserUsernameSchema = z
  .string()
  .min(env.NEXT_PUBLIC_SQUADY_API_USER_USERNAME_MIN_LENGTH, {
    message: `Имя пользователя должно содержать минимум ${env.NEXT_PUBLIC_SQUADY_API_USER_USERNAME_MIN_LENGTH} символа.`,
  })
  .max(env.NEXT_PUBLIC_SQUADY_API_USER_USERNAME_MAX_LENGTH, {
    message: `Имя пользователя должно содержать максимум ${env.NEXT_PUBLIC_SQUADY_API_USER_USERNAME_MAX_LENGTH} символов.`,
  })
  .regex(new RegExp(env.NEXT_PUBLIC_SQUADY_API_USER_USERNAME_PATTERN), {
    message:
      "Имя пользователя может содержать только латинские буквы, цифры и подчёркивания.",
  });

export const UserEmailSchema = z.string().email("Неверный формат e-mail.");

export const UserPasswordSchema = z
  .string()
  .min(env.NEXT_PUBLIC_SQUADY_API_USER_PASSWORD_MIN_LENGTH, {
    message: `Пароль должен содержать минимум ${env.NEXT_PUBLIC_SQUADY_API_USER_PASSWORD_MIN_LENGTH} символов.`,
  })
  .max(env.NEXT_PUBLIC_SQUADY_API_USER_PASSWORD_MAX_LENGTH, {
    message: `Пароль должен содержать максимум ${env.NEXT_PUBLIC_SQUADY_API_USER_PASSWORD_MAX_LENGTH} символов.`,
  })
  .regex(new RegExp(env.NEXT_PUBLIC_SQUADY_API_USER_PASSWORD_PATTERN), {
    message: "Пароль может содержать только латинские буквы, цифры и !@#$%^&*.",
  });

export const UserFullName = z
  .string()
  .min(1, {
    message: "Введите ФИО.",
  })
  .regex(new RegExp(env.NEXT_PUBLIC_SQUADY_API_USER_FULL_NAME_PATTERN), {
    message:
      "ФИО должно быть из 2–3 слов и может содержать только латинские буквы, кириллицу, точку, дефис и пробел.",
  });

export const UserBirthDate = z
  .string()
  .date("Неверная дата.")
  .refine(
    (date) =>
      new Date(date).setHours(0, 0, 0, 0) <= getMaxBirthDate().getTime(),
    {
      message: `Минимальный возраст ${env.NEXT_PUBLIC_SQUADY_API_USER_BIRTH_DATE_MIN_YEARS} лет.`,
    },
  )
  .refine(
    (date) =>
      new Date(date).setHours(0, 0, 0, 0) >= getMinBirthDate().getTime(),
    {
      message: `Максимальный возраст ${env.NEXT_PUBLIC_SQUADY_API_USER_BIRTH_DATE_MAX_YEARS} лет.`,
    },
  );

export const UserCity = z
  .string()
  .max(env.NEXT_PUBLIC_SQUADY_API_USER_CITY_MAX_LENGTH, {
    message: `Названия города не может содержать более ${env.NEXT_PUBLIC_SQUADY_API_USER_CITY_MAX_LENGTH} символов.`,
  })
  .optional();

export const UserTelegram = z
  .string()
  .min(1, { message: "Введите имя пользователя в Telegram." })
  .regex(new RegExp(env.NEXT_PUBLIC_SQUADY_API_USER_TELEGRAM_PATTERN), {
    message:
      "Имя пользователя в Telegram может содержать только латинские буквы, цифры и подчёркивания.",
  });

export const UserAbout = z
  .string()
  .max(env.NEXT_PUBLIC_SQUADY_API_USER_ABOUT_MAX_LENGTH, {
    message: `О себе не может содержать более ${env.NEXT_PUBLIC_SQUADY_API_USER_ABOUT_MAX_LENGTH} символов.`,
  })
  .optional();
