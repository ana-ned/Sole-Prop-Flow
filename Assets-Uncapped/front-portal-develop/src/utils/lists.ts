export const sortByPredefinedValues = <T>(
  data: T[],
  order: string[],
  key: keyof T
) => {
  const orderMap = new Map<any, number>(
    order.map((value, index) => [value, index])
  )

  return data.toSorted((a, b) => {
    const aIndex = orderMap.get(a[key])
    const bIndex = orderMap.get(b[key])
    if (aIndex !== undefined && bIndex !== undefined) {
      return aIndex - bIndex
    }
    return aIndex === undefined ? 1 : -1
  })
}

export const groupByFirstLetter = <T>(items: T[], key: keyof T) => {
  const store: Record<string, T[]> = {}

  items.forEach((item: any) => {
    const letter = item[key].charAt(0)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const keyStore = store[letter] || (store[letter] = [])
    keyStore.push(item)
  })

  return store
}

export const stringifyWithSets = (obj: unknown): string => {
  return JSON.stringify(obj, (_, value) => {
    if (value instanceof Set) {
      return [...value]
    }
    return value
  })
}
