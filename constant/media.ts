export enum MEDIA_TYPE {
  MOVIE = 'movie',
  MUSIC = 'music',
  SOUND = 'sound',
  EBOOK = 'ebook',
}

export enum MEDIA_NAME {
  movie = '影视节目',
  music = '音乐歌曲',
  sound = '有声读物',
  ebook = '图书杂志',
}

export const MEDIA_LIST = [
  {
    label: MEDIA_NAME.movie,
    value: MEDIA_TYPE.MOVIE,
  },
  {
    label: MEDIA_NAME.ebook,
    value: MEDIA_TYPE.EBOOK,
  },
  {
    label: MEDIA_NAME.sound,
    value: MEDIA_TYPE.SOUND,
  },
  {
    label: MEDIA_NAME.music,
    value: MEDIA_TYPE.MUSIC,
  },
]
