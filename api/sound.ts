import request from '@/utils/request'

export function classTopLayerGet() {
  return request<TSoundTopClass[]>({
    url: 'clinet/dis/sound/classTopLayerGet',
    method: 'POST',
  })
}

export function classNextLayerGet(data: { cid: string }) {
  return request({
    url: 'clinet/dis/sound/classNextLayerGet',
    method: 'POST',
    data,
  })
}

export function resGet(data: { cid: string; page: number; size: number }) {
  return request<TPageResult<TSound>>({
    url: 'clinet/dis/sound/resGet',
    method: 'POST',
    data,
  })
}

export function resMediaGet(data: { rid: string }) {
  return request({
    url: 'clinet/dis/sound/resMediaGet',
    method: 'POST',
    data,
  })
}
