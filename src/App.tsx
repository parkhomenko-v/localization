import React, {useState} from 'react';
import localization from './packages/core/localization';
import {DE, EN} from './packages/core/constants';
import Provider from './packages/react/Provider';
import useTranslate from './packages/react/use-translate';
import logo from './logo.svg';
import './App.css';

const api = localization();

api.register(EN, {
    [`language_${EN}`]: 'English',
    [`language_${DE}`]: 'Deutsch',
    'change_language': 'Change language',
    'hello_react': 'Hello React',
    'selected_language': 'Selected language: {{language}}',
    'selected_locale': 'Selected locale: {{locale}}'
});
api.register(DE, {
    [`language_${EN}`]: 'Englisch',
    [`language_${DE}`]: 'Deutsch',
    'change_language': 'Sprache ändern',
    'hello_react': 'Hallo React',
    'selected_language': 'Ausgewählte Sprache: {{language}}',
    'selected_locale': 'Ausgewähltes Gebietsschema: {{locale}}'
});

api.switch(EN);

function App() {
    return (
        <Provider api={api}>
            <Nested />
        </Provider>
    );
}

function Nested() {
    const t = useTranslate();
    const handleChange = (event: any) => {
        t.switch(event.target.value);
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <div className="change-language">
                    <div>
                        <label htmlFor="language">
                            {t('change_language')}
                        </label>
                    </div>
                    <div>
                        {'\u2192'}
                    </div>
                    <div className="select">
                        <select
                            name="language"
                            id="language"
                            value={t.lang()}
                            onChange={handleChange}
                        >
                            {t.list().map(locale => (
                                <option
                                    key={locale}
                                    value={locale}
                                >
                                    {t(`language_${locale}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <p>
                    {t('hello_react')}!
                </p>
                <p>
                    {t.format('selected_language', {language: t(`language_${t.lang()}`)})}
                </p>
                <p>
                    {t.format('selected_locale', {locale: t.lang()})}
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
