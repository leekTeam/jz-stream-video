/**
 * 给对象的 key(string) 增加 指定前缀
 * tdosh 会把第一个字母变成大写，这个不会
 *
 * {
 *  color: string
 * }
 *
 *  =>>
 *
 * {
 *  --color: string
 * }
 *
 */
export declare type ObjAddPrefix<Origin extends Record<string, any>, Prefix extends string = ''> = {
  [K in {
    [K2 in keyof Origin]: K2 extends string ? `${Prefix}${K2}` : never;
  }[keyof Origin]]: K extends `${Prefix}${infer RK}` ? RK extends string ? Origin[RK] : never : never;
}
