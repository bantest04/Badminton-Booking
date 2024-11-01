'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchParamsHandler({ children }) {
  const searchParams = useSearchParams()
  return children({ searchParams })
}