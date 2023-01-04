import { resultPageSuccess, resultSuccess } from './_utils'

export default [
  {
    url: 'clinet/dis/sound/classTopLayerGet',
    timeout: 100,
    method: 'post',
    response: () => {
      return resultSuccess({
        dataObject: [
          {
            id: 1,
            cid: '9a2011d4715c472aaa5b279c836b1219',
            level: 1,
            name: '诗词歌赋',
            poster: null,
            precid: 0,
            resnum: 2,
            restype: 22,
            shownum: 2,
            tips: '有声资源',
          },
          {
            id: 2,
            cid: 'a62386452f46498eb67137d3423c1403',
            level: 1,
            name: '相声小品',
            poster: null,
            precid: 0,
            resnum: 4,
            restype: 22,
            shownum: 3,
            tips: '有声资源',
          },
          {
            id: 3,
            cid: '75121ff6a2b348ab8717ff713aafa2c6',
            level: 1,
            name: '名家讲坛',
            poster: null,
            precid: 0,
            resnum: 8,
            restype: 22,
            shownum: 1,
            tips: '一级分类',
          },
        ],
      })
    },
  },
  {
    url: 'clinet/dis/sound/classNextLayerGet',
    timeout: 100,
    method: 'post',
    response: () => {
      return resultSuccess({
        dataObject: [
          {
            id: 1,
            cid: '9a2011d4715c472aaa5b279c836b1219',
            level: 1,
            name: '诗词歌赋',
            poster: null,
            precid: 0,
            resnum: 2,
            restype: 22,
            shownum: 2,
            tips: '有声资源',
          },
        ],
      })
    },
  },
  {
    url: 'clinet/dis/sound/resGet',
    timeout: 100,
    method: 'post',
    response: ({ body }: any) => {
      const { page = 1, size = 10 } = body
      const dataObject = [
        {
          id: 1,
          attrint: null,
          attrstr: null,
          country: '中国',
          label: '唐诗',
          language: '中文',
          mainauthor: '崔颢',
          name: '行经华阴',
          orgtype: 0,
          otherauthor: null,
          paytype: null,
          pinyin: 'xjhy',
          poster:
            'http://192.168.88.112:8081/media/res/sound/d3b47ad1077d4c85ac302490c00eb274/poster/a08030829c1646498cbdf4720ccbb236.jpg',
          programid: 'jzby',
          provider: '诗词大全',
          restype: 22,
          rid: 'd3b47ad1077d4c85ac302490c00eb274',
          score: '0.0',
          source: '网络',
          status: 0,
          summary: '古诗文',
          tips: '诗词',
          tolnum: 1,
          years: '古代',
          cid: '9a2011d4715c472aaa5b279c836b1219',
          reserve: null,
        },
        {
          id: 2,
          attrint: null,
          attrstr: null,
          country: '中国',
          label: '唐诗',
          language: '中文',
          mainauthor: '韦庄',
          name: '章台夜思',
          orgtype: 0,
          otherauthor: null,
          paytype: null,
          pinyin: 'ztys',
          poster:
            'http://192.168.88.112:8081/media/res/sound/74a5a4b6e688468bb661ac48d970fa4c/poster/02a163b329a14eb18c77130bbcbff84c.jpg',
          programid: 'jzby',
          provider: '诗词大全',
          restype: 22,
          rid: '74a5a4b6e688468bb661ac48d970fa4c',
          score: '0.0',
          source: '网络',
          status: 0,
          summary: '古诗文',
          tips: '诗词',
          tolnum: 1,
          years: '古代',
          cid: '9a2011d4715c472aaa5b279c836b1219',
          reserve: null,
        },
      ]

      return resultPageSuccess(page, size, dataObject)
    },
  },
  {
    url: 'clinet/dis/sound/resMediaGet',
    timeout: 100,
    method: 'post',
    response: ({ body }: any) => {
      const { rid } = body
      console.log(rid)
      return resultSuccess({
        dataObject: [
          {
            id: 10,
            attrint: 0,
            attrstr: null,
            details: '曾国藩',
            downloadurl:
              'http://192.168.88.112:8081/media/res/sound/a3e758cb3d2348d29c2acc85aa1d3f7f/1/org/f1bc7c70e9a74e0f97663f4856d44975.mp3',
            duration: 0,
            mediatype: 200,
            mid: 'f1bc7c70e9a74e0f97663f4856d44975',
            name: 1,
            number: 1,
            playurl:
              'http://192.168.88.112:8081/media/res/sound/a3e758cb3d2348d29c2acc85aa1d3f7f/1/org/f1bc7c70e9a74e0f97663f4856d44975.mp3',
            rid: 'a3e758cb3d2348d29c2acc85aa1d3f7f',
            size: 22409140,
            status: 1,
          },
        ],
      })
    },
  },
]
