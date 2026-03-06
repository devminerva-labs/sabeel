import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRamadanContext } from '@/hooks/useRamadanContext'
import {
  getMyHalaqahs,
  getLeaderboard,
  createHalaqah,
  joinHalaqah,
  leaveHalaqah,
} from '@/lib/api/halaqah.api'
import type { RamadanYear } from '@/types'
import { ramadanYear as toRamadanYear } from '@/types'

// Fallback year when Ramadan hasn't started yet
const CURRENT_YEAR = toRamadanYear(new Date().getFullYear())

export function useHalaqah(userId: string | null, selectedHalaqahId?: string | null) {
  const qc = useQueryClient()
  const { ramadanYear } = useRamadanContext()
  const year: RamadanYear = ramadanYear ?? CURRENT_YEAR

  const membershipsQuery = useQuery({
    queryKey: ['halaqahs', userId, year],
    queryFn: () => getMyHalaqahs(userId!, year),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  const memberships = membershipsQuery.data?.memberships ?? []
  const membershipsError = membershipsQuery.data?.error ?? membershipsQuery.error?.message ?? null

  const leaderboardQuery = useQuery({
    queryKey: ['halaqah-leaderboard', selectedHalaqahId, year],
    queryFn: () => getLeaderboard(selectedHalaqahId!, year, userId!),
    enabled: !!selectedHalaqahId && !!userId,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 30,
    refetchIntervalInBackground: false,
  })

  const createMutation = useMutation({
    mutationFn: ({ name, nickname }: { name: string; nickname: string }) =>
      createHalaqah(userId!, name, nickname, year),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['halaqahs', userId, year] }),
  })

  const joinMutation = useMutation({
    mutationFn: ({ inviteCode, nickname }: { inviteCode: string; nickname: string }) =>
      joinHalaqah(userId!, inviteCode, nickname),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['halaqahs', userId, year] }),
  })

  const leaveMutation = useMutation({
    mutationFn: (halaqahId: string) => leaveHalaqah(halaqahId, userId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['halaqahs', userId, year] })
      qc.invalidateQueries({ queryKey: ['halaqah-leaderboard'] })
    },
  })

  return {
    memberships,
    isLoadingMemberships: membershipsQuery.isLoading,
    membershipsError,
    leaderboard: leaderboardQuery.data ?? [],
    isLoadingLeaderboard: leaderboardQuery.isLoading,
    createHalaqah: createMutation.mutateAsync,
    joinHalaqah: joinMutation.mutateAsync,
    leaveHalaqah: leaveMutation.mutateAsync,
    createError: createMutation.data?.error ?? null,
    joinError: joinMutation.data?.error ?? null,
  }
}
