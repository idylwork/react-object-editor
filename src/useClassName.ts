import React, { useContext } from 'react';

/** CSSクラス名作成コールバックを管理 */
export const ClassNamePrefixContext = React.createContext<(...names: string[]) => string>(() => '');

/**
 * CSSクラス名作成コールバックを受け渡す
 * @returns
 */
const useClassName = () => {
  return useContext(ClassNamePrefixContext)
}

export default useClassName;