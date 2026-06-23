import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { debounce } from "lodash-es"

const useDebouncedSearch = <T>({
  queryKey,
  queryFn,
}: {
  queryKey: string
  queryFn: (query: string) => Promise<T[]>
}) => {
  const [query, setQuery] = useState("")

  const { data, isFetching, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: () => (query.length === 0 ? [] : queryFn(query)),
    enabled: false,
  })

  const debouncedRefetchRef = useRef(
    debounce(() => {
      void refetch()
    }, 700)
  )

  useEffect(() => {
    const debouncedFn = debouncedRefetchRef.current
    return () => {
      debouncedFn.cancel()
    }
  }, [])

  useEffect(() => {
    debouncedRefetchRef.current()
  }, [query])

  return { data: data ?? [], isFetching, setQuery }
}

export default useDebouncedSearch
