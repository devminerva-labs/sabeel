import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRamadanContext } from '@/hooks/useRamadanContext'
import {
  getMyHalaqah,
  getLeaderboard,
  createHalaqah,
  joinHalaqah,
  leaveHalaqah,
} from '@/lib/api/halaqah.api'
import type { RamadanYear } from '@/types'
import { ramadanYear as toRamadanYear } from '@/types'

// Fallback year when Ramadan hasn't started yet
const CURRENT_YEAR = toRamadanYear(new Date().getFullYear())

export function useHalaqah(userId: string | null) {
  const qc = useQueryClient()
  const { ramadanYear } = useRamadanContext()
  const year: RamadanYear = ramadanYear ?? CURRENT_YEAR

  const halaqahQuery = useQuery({
    queryKey: ['halaqah', userId, year],
    queryFn: () => getMyHalaqah(userId!, year),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  const halaqah = halaqahQuery.data?.halaqah ?? null
  const myNickname = halaqahQuery.data?.nickname ?? null
  const halaqahError = halaqahQuery.data?.error ?? halaqahQuery.error?.message ?? null

  const leaderboardQuery = useQuery({
    queryKey: ['halaqah-leaderboard', halaqah?.id, year],
    queryFn: () => getLeaderboard(halaqah!.id, year, userId!),
    enabled: !!halaqah && !!userId,
    staleTime: 0, // Always check for fresh data when component mounts
    refetchInterval: 1000 * 30, // Poll every 30 seconds when on the page
  })

  const createMutation = useMutation({
    mutationFn: ({ name, nickname }: { name: string; nickname: string }) =>
      createHalaqah(userId!, name, nickname, year),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['halaqah', userId, year] }),
  })

  const joinMutation = useMutation({
    mutationFn: ({ inviteCode, nickname }: { inviteCode: string; nickname: string }) =>
      joinHalaqah(userId!, inviteCode, nickname),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['halaqah', userId, year] }),
  })

  const leaveMutation = useMutation({
    mutationFn: () => leaveHalaqah(halaqah!.id, userId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['halaqah', userId, year] })
      qc.invalidateQueries({ queryKey: ['halaqah-leaderboard'] })
    },
  })

  return {
    halaqah,
    myNickname,
    isLoadingHalaqah: halaqahQuery.isLoading,
    halaqahError,
    leaderboard: leaderboardQuery.data ?? [],
    isLoadingLeaderboard: leaderboardQuery.isLoading,
    createHalaqah: createMutation.mutateAsync,
    joinHalaqah: joinMutation.mutateAsync,
    leaveHalaqah: leaveMutation.mutateAsync,
    createError: createMutation.data?.error ?? null,
    joinError: joinMutation.data?.error ?? null,
  }
}
