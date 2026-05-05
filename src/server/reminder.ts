import { Lunar } from "lunar-typescript";
import type { InsertReminder, UpdateReminder } from "../db/schemas/app.ts";
import {
  dateToLunar,
  getLunarCurrentMonth,
  getLunarCurrentYear,
  getLunarNextYear,
  lunarToDate,
  solarToDate,
} from "../lib/lunar.ts";
import { ZRepeatOption } from "../models/index.ts";

export function getNextAlertDate(reminder: InsertReminder | UpdateReminder): Date | undefined {
  const { repeat, reminderDate } = reminder;
  if (!reminderDate) return undefined;

  const lunar = dateToLunar(reminderDate);

  const now = new Date();
  const nowTime = now.getTime();

  const lunarTime = solarToDate(lunar.getSolar()).getTime();

  if (lunarTime >= nowTime) return lunarToDate(lunar);

  if (repeat === ZRepeatOption.enum.yearly) {
    return getNextAlertDateYearly(lunar);
  }

  if (repeat === ZRepeatOption.enum.monthly) {
    return getNextAlertDateMonthly(lunar);
  }

  return undefined;
}

function getNextAlertDateYearly(lunar: Lunar): Date | undefined {
  const now = new Date();
  const lunarCurrentYear = getLunarCurrentYear(lunar);
  if (!lunarCurrentYear) return undefined;

  const lunarTime = solarToDate(lunarCurrentYear.getSolar()).getTime();
  const nowTime = now.getTime();

  if (lunarTime >= nowTime) return lunarToDate(lunarCurrentYear);

  const lunarNextYear = getLunarNextYear(lunarCurrentYear);
  if (!lunarNextYear) return undefined;

  return lunarToDate(lunarNextYear);
}

function getNextAlertDateMonthly(lunar: Lunar): Date | undefined {
  const lunarCurrentMonth = getLunarCurrentMonth(lunar);
  if (!lunarCurrentMonth) return undefined;

  return lunarToDate(lunarCurrentMonth);
}
