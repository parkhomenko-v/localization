import React from 'react';
import {ILocalizationApi} from '../core/localization';
import Context from './Context';

export type IProps = {
  api: ILocalizationApi;
  children: any;
};

function Provider(props: IProps) {
  return (
    <Context.Provider value={props.api}>
      {props.children}
    </Context.Provider>
  );
}

export default Provider;
