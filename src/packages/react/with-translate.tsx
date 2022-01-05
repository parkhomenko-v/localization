import {createElement, ComponentType, useState, useEffect, useContext} from 'react';
import {ILocalizationApi} from '../core/localization';
import Context from './Context';
import {EMPTY_DEPS} from './constants';

export type ITranslateComponent<P> = ComponentType<IProps<P>>;

export type ITranslateComponentProps = {
  t: ILocalizationApi;
};

type IProps<P> = (
    & Omit<P, keyof ITranslateComponentProps>
    & Partial<ITranslateComponentProps>
);

function withTranslate<P = {}>(C: ComponentType<P>): ITranslateComponent<P> {
  function Translate(props: any) {
    const t: ILocalizationApi = useContext(Context);
    const [_rev, set] = useState(0);

    useEffect(() => t.subscribe(() => set(n => n + 1)), EMPTY_DEPS);

    // Pass "_rev" prop for re-render the component
    // For ex. in case of using with redux "connect"
    // "Connect" wrap component into "React.memo",
    //  the component will not update if language had been changed
    //  because "t" is the same object
    return createElement(C, {...props, t, _rev});
  }

  Translate.displayName = `withTranslate(${C.displayName || C.name})`;

  Translate.WrappedComponent = C;

  return Translate;
}

export default withTranslate;
