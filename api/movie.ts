import request from '@/utils/request'

export function classTopLayerGet() {
  return request<TMovieTopClass[]>({
    url: 'clinet/dis/movie/classTopLayerGet',
    method: 'POST',
  })
}

export function classNextLayerGet(data: { cid: string }) {
  return request({
    url: 'clinet/dis/movie/classNextLayerGet',
    method: 'POST',
    data,
  })
}

export function resGet(data: { cid: string; page: number; size: number }) {
  return request<TPageResult<TMovie>>({
    url: 'clinet/dis/movie/resGet',
    method: 'POST',
    data,
  })
}

export function resMediaGet(data: { rid: string }) {
  return request({
    url: 'clinet/dis/movie/resMediaGet',
    method: 'POST',
    data,
  })
}
