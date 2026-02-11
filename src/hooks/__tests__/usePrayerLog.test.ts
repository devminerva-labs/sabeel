/**
 * usePrayerLog — unit tests using fake-indexeddb
 *
 * Run: npm test
 */
import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import Dexie from 'dexie'
import { db } from '@/lib/db'

// Reset the DB between tests
beforeEach(async () => {
  await db.prayerLogs.clear()
})

describe('prayerLogs table', () => {
  it('writes a prayed record', async () => {
    const now = new Date().toISOString()
    const date = now.slice(0, 10)

    await db.prayerLogs.add({
      date,
      prayer: 'fajr',
      status: 'prayed',
      prayedAt: now,
      updatedAt: now,
    })

    const records = await db.prayerLogs.toArray()
    expect(records).toHaveLength(1)
    expect(records[0]?.prayer).toBe('fajr')
    expect(records[0]?.status).toBe('prayed')
  })

  it('updates status from prayed to missed', async () => {
    const now = new Date().toISOString()
    const date = now.slice(0, 10)

    const id = await db.prayerLogs.add({
      date,
      prayer: 'dhuhr',
      status: 'prayed',
      prayedAt: now,
      updatedAt: now,
    })

    await db.prayerLogs.update(id, { status: 'missed', updatedAt: now })

    const record = await db.prayerLogs.get(id)
    expect(record?.status).toBe('missed')
  })

  it('deletes record (untracked state)', async () => {
    const now = new Date().toISOString()
    const date = now.slice(0, 10)

    const id = await db.prayerLogs.add({
      date,
      prayer: 'asr',
      status: 'missed',
      updatedAt: now,
    })

    await db.prayerLogs.delete(id)

    const record = await db.prayerLogs.get(id)
    expect(record).toBeUndefined()
  })

  it('compound key query returns only today records', async () => {
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const now = new Date().toISOString()

    await db.prayerLogs.bulkAdd([
      { date: today, prayer: 'fajr', status: 'prayed', prayedAt: now, updatedAt: now },
      { date: yesterday, prayer: 'fajr', status: 'prayed', prayedAt: now, updatedAt: now },
    ])

    const todayRecords = await db.prayerLogs
      .where('[date+prayer]')
      .between([today, ''], [today, '\uffff'])
      .toArray()

    expect(todayRecords).toHaveLength(1)
    expect(todayRecords[0]?.date).toBe(today)
  })
})

// Silence Dexie version warning in test output
Dexie.debug = false
