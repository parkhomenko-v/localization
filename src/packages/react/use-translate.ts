import {useState, useEffect, useContext} from 'react';
import {ILocalizationApi} from '../core/localization';
import Context from './Context';
import {EMPTY_DEPS} from './constants';

function useTranslate(): ILocalizationApi {
  const t: ILocalizationApi = useContext(Context);
  const [, set] = useState(0);

  useEffect(() => t.subscribe(() => set(n => n + 1)), EMPTY_DEPS);

  return t;
}

export default useTranslate;
