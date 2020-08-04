export interface IStore{
  __excludeKeys: Array<string> | undefined
  [index: string]: any
}