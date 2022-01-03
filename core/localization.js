function localization() {
  const state = {
    lng: '',
    reg: [],
    res: {},
    sub: []
  };
  const translate = namespace => {
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

  translate.format = (namespace, replace) => {
    const text = translate(namespace);

    return text.replace(/{{(.*?)}}/g, (template, key) => {
      const value = replace[key];

      return value == null ? template : value;
    });
  };

  translate.register = (lng, res) => {
    if (process.env.NODE_ENV !== 'production') {
      if (state.res[lng]) {
        console.error(`localization: language "${lng}" already registered.`);

        return;
      }
    }

    state.reg.push(lng);
    state.res[lng] = JSON.parse(JSON.stringify(res));
  };

  translate.subscribe = (listener) => {
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

  translate.switch = (lng) => {
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

  translate.lang = () => state.lng;

  translate.list = () => state.reg;

  return translate;
}

export default localization;
