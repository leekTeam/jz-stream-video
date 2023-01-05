export const themeConfig = {
  red: {
    'color-primary': '#E74C3C',
    'color-primary-disable': '#C0392B',
    'color-primary-light': '#ff7675',
  },
  green: {
    'color-primary': '#48701A',
    'color-primary-disable': '#314B0A',
    'color-primary-light': '#b8e994',
  },
  blue: {
    'color-primary': '#3498DB',
    'color-primary-disable': '#2980B9',
    'color-primary-light': '#74b9ff',
  },
} as const

export const themeOptions = [
  {
    label: '中国红',
    value: 'red',
    color: '#E74C3C',
  },
  {
    label: '军营绿',
    value: 'green',
    color: '#48701A',
  },
  {
    label: '九州蓝',
    value: 'blue',
    color: '#3498DB',
  },
] as const

export interface Theme {
  'color-primary': string
  'color-primary-disable': string
  'color-primary-light': string
}
export type ThemeType = keyof typeof themeConfig
