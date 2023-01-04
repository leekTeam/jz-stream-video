const totalPage = 10

export function resultSuccess(data: any) {
  return {
    errorInfo: '请求成功',
    errorCode: 0,
    ...data,
  }
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize)
  return offset + Number(pageSize) >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + Number(pageSize))
}

export function resultPageSuccess<T = any>(
  page: number,
  size: number,
  dataObject: T[],
) {
  const pageData = dataObject.map((item, index) => {
    return {
      ...item,
      id: page * index,
      rid: `${item.rid}index`,
    }
  })

  return resultSuccess({
    dataObject: pageData,
    totalElements: totalPage * size,
    totalPage,
    last: page === totalPage,
    numberOfElements: pageData.length,
  })
}
