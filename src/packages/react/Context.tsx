import {createContext} from 'react';
import {ILocalizationApi} from '../core/localization';

export default createContext<ILocalizationApi>({} as ILocalizationApi);
