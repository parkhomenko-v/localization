export type ILocalizationApi = (
    & ITranslateFunction
    & ITranslateStaticMethods
);

export type IInternalState = {
    lng: ILanguage;
    reg: ILanguage[];
    res: IResources;
    sub: IListener[];
};

export type ITranslateFunction = (
    namespace: INamespace
) => ITranslation;

export type ITranslateStaticMethods = {
    format: IFormatFunction;
    register: IRegisterFunction;
    switch: ISwitchFunction;
    subscribe: ISubscribeFunction;
    lang: ILanguageFunction;
    list: ILanguagesFunction;
};

export type IFormatFunction = (
    namespace: INamespace,
    replace: IReplace
) => ITranslation;

export type IRegisterFunction = (
    lng: ILanguage,
    res: ILanguageResources
) => void;

export type ISwitchFunction = (
    lng: ILanguage
) => void;

export type ISubscribeFunction = (
    listener: IListener
) => IUnsubscribeFunction;

export type IUnsubscribeFunction = () => void;

export type ILanguageFunction = () => ILanguage;

export type ILanguagesFunction = () => ILanguage[];

export type IReplace = {
    [keyToReplace: string]: IReplaceValue;
};

export type IReplaceValue = string | number;

export type IResources = {
    [K in ILanguage]: ILanguageResources;
};

export type IListener = () => void;

export type ILanguageResources = {
    [K in INamespace]: ITranslation;
};

export type ILanguage = string;

export type INamespace = string;

export type ITranslation = string;

function localization(): ILocalizationApi {
    const state: IInternalState = {
        lng: '',
        reg: [],
        res: {},
        sub: []
    };

    const translate: ITranslateFunction = namespace => {
        // istanbul ignore else
        // Make render faster, avoid any condition on production
        if (process.env.NODE_ENV !== 'production') {
            if (!state.res[state.lng]) {
                console.error(`localization: missing language "${state.lng}" in registry.`);

                return `@missing_language[${state.lng}]`;
            }

            if (!state.res[state.lng][namespace]) {
                console.error(`localization: missing translation for "${namespace}" in language "${state.lng}".`);

                return `@missing_namespace[${namespace}]`;
            }
        }

        return state.res[state.lng][namespace];
    };

    (translate as ILocalizationApi).format = (namespace, replace) => {
        const text = translate(namespace);

        return text.replace(
            /{{(.*?)}}/g,
            (template, key) => {
                const value = replace[key] as string;

                return value == null ? template : value;
            });
    };

    (translate as ILocalizationApi).register = (lng, res) => {
        // istanbul ignore else
        if (process.env.NODE_ENV !== 'production') {
            if (state.res[lng]) {
                console.error(`localization: language "${lng}" already registered.`);

                return;
            }
        }

        state.reg.push(lng);
        state.res[lng] = JSON.parse(JSON.stringify(res));
    };

    (translate as ILocalizationApi).subscribe = (listener) => {
        // istanbul ignore else
        if (process.env.NODE_ENV !== 'production') {
            if (typeof listener !== 'function') {
                console.error('localization: expected the listener to be a function.');
            }
        }

        let subscribed = true;

        state.sub.push(listener);

        return () => {
            if (subscribed) {
                subscribed = false;

                state.sub.splice(state.sub.indexOf(listener), 1);
            }
        };
    };

    (translate as ILocalizationApi).switch = (lng) => {
        // istanbul ignore else
        if (process.env.NODE_ENV !== 'production') {
            if (!state.res[lng]) {
                console.error(`localization: missing language "${lng}" in registry.`);
            }
        }

        if (state.lng !== lng) {
            state.lng = lng;

            for (const notify of state.sub) {
                notify();
            }
        }
    };

    (translate as ILocalizationApi).lang = () => state.lng;

    (translate as ILocalizationApi).list = () => state.reg;

    // istanbul ignore else
    // - only for testing
    // - "_sub" haven't added to typescript
    //    to not show on linters or editor autocomplete
    if (process.env.NODE_ENV === 'test') {
        (translate as any)._sub = () => state.sub;
    }

    return translate as ILocalizationApi;
}

export default localization;
