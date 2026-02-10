import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import {
  deleteReminder,
  insertReminder,
  updateReminder
} from '../db/reminder.ts'
import { ZInsertReminder, ZUpdateReminder } from '../db/schema.ts'
import { getNextAlertDate } from './reminder.ts'

const app = new Hono()
  .basePath('/api')
  .get('/health', (c) => {
    return c.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    })
  })
  .post('/reminders', zValidator('json', ZInsertReminder), async (c) => {
    try {
      const reminder = c.req.valid('json')
      const nextAlertDate = getNextAlertDate(reminder)

      const insertReminderData = { ...reminder, nextAlertDate }
      const id = await insertReminder(insertReminderData)

      return c.json({ id })
    } catch (error) {
      console.error(error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  })
  .patch('/reminders/:id', zValidator('json', ZUpdateReminder), async (c) => {
    const id = c.req.param('id')

    try {
      const reminder = c.req.valid('json')
      let updateReminderData = reminder
      if (reminder.reminderDate) {
        const nextAlertDate = getNextAlertDate(reminder)
        updateReminderData = { ...reminder, nextAlertDate }
      }
      await updateReminder(id, updateReminderData)

      return c.json({ message: 'Reminder updated' })
    } catch (error) {
      console.error(error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  })
  .delete('/reminders/:id', async (c) => {
    const id = c.req.param('id')

    try {
      await deleteReminder(id)

      return c.json({ message: 'Reminder deleted' })
    } catch (error) {
      console.error(error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  })

export default app
export type AppType = typeof app
