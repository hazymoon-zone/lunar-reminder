import { Lunar } from 'lunar-typescript'
import type { InsertReminder, UpdateReminder } from '../db/schema'
import {
  dateToLunar,
  getLunarNextMonth,
  getLunarNextYear,
  solarToDate
} from '../lib/lunar'
import { ZRepeatOption } from '../models'

export function getNextAlertDate(
  reminder: InsertReminder | UpdateReminder
): Date | null {
  const { repeat, reminderDate } = reminder
  if (!reminderDate) return null

  const lunar = dateToLunar(reminderDate)

  const now = new Date()
  const lunarNow = Lunar.fromDate(now)

  if (lunar >= lunarNow) return solarToDate(lunar.getSolar())

  if (repeat === ZRepeatOption.enum.yearly) {
    const lunarNextYear = getLunarNextYear(lunar)
    return lunarNextYear ? solarToDate(lunarNextYear.getSolar()) : null
  }

  if (repeat === ZRepeatOption.enum.monthly) {
    const lunarNextMonth = getLunarNextMonth(lunar)
    return lunarNextMonth ? solarToDate(lunarNextMonth.getSolar()) : null
  }

  return null
}
