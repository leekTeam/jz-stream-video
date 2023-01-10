declare global {
  interface TPageResult<T> {
    content: T[]
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    pageable: {
      offset: number
      pageNumber: number
      pageSize: number
    }
    paged: boolean
    sort: any
    sorted: boolean
    unsorted: boolean
  }
}

export {}
