declare global {
  interface TPageResult<T> {
    content: T[]
    totalElements: number
    totalPage: number
    last: boolean
    numberOfElements: number
  }
}

export {}
