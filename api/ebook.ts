import request from '@/utils/request'

export function classTopLayerGet() {
  return request<TEbookTopClass[]>({
    url: 'clinet/dis/ebook/classTopLayerGet',
    method: 'POST',
  })
}

export function classNextLayerGet(data: { cid: string }) {
  return request({
    url: 'clinet/dis/ebook/classNextLayerGet',
    method: 'POST',
    data,
  })
}

export function resGet(data: { cid: string; page: number; size: number }) {
  return request<TPageResult<TEbook>>({
    url: 'clinet/dis/ebook/resGet',
    method: 'POST',
    data,
  })
}

export function resMediaGet(data: { rid: string }) {
  return request<TEbookMedia[]>({
    url: 'clinet/dis/ebook/resMediaGet',
    method: 'POST',
    data,
  })
}
