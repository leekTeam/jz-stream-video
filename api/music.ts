import request from '@/utils/request'

export function classTopLayerGet() {
  return request<{ dataObject: TMusicTopClass[] }>({
    url: 'clinet/dis/music/classTopLayerGet',
    method: 'POST',
  })
}

export function classNextLayerGet(data: { cid: string }) {
  return request({
    url: 'clinet/dis/music/classNextLayerGet',
    method: 'POST',
    data,
  })
}

export function resGet(data: { cid: string; page: number; size: number }) {
  return request<TPageResult<TMusic>>({
    url: 'clinet/dis/music/resGet',
    method: 'POST',
    data,
  })
}

export function resMediaGet(data: { rid: string }) {
  return request({
    url: 'clinet/dis/music/resMediaGet',
    method: 'POST',
    data,
  })
}
