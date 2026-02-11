// Branded types prevent silent ID confusion at compile time

export type JuzId = number & { readonly _brand: 'JuzId' }
export type SurahId = number & { readonly _brand: 'SurahId' }
export type RamadanYear = number & { readonly _brand: 'RamadanYear' }

// Constructors — validate at boundary, then pass branded types everywhere
export function juzId(n: number): JuzId {
  if (n < 1 || n > 30) throw new RangeError(`Invalid JuzId: ${n}`)
  return n as JuzId
}

export function surahId(n: number): SurahId {
  if (n < 1 || n > 114) throw new RangeError(`Invalid SurahId: ${n}`)
  return n as SurahId
}

export function ramadanYear(n: number): RamadanYear {
  if (n < 2020 || n > 2040) throw new RangeError(`Invalid RamadanYear: ${n}`)
  return n as RamadanYear
}
