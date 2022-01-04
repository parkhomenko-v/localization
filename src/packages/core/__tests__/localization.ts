import localization, {ILocalizationApi} from '../localization';

describe('localization in production mode', () => {
    let t: ILocalizationApi;

    beforeEach(() => {
        t = localization();

        t.register('de', {
            'first_name': 'Vorname',
            'last_name': 'Nachname',
            'developer': 'Frontend-Entwickler',
            'template-string': 'Ich heiße {{firstName}} {{lastName}}. Ich bin {{position}}.',
            'selected-on-page': '{{total}} Einträge ausgewählt, {{count}} auf aktueller Seite'
        });
        t.register('en', {
            'first_name': 'First name',
            'last_name': 'Last name',
            'developer': 'Frontend developer',
            'template-string': 'My name is {{firstName}} {{lastName}}. I am a {{position}}.',
            'selected-on-page': '{{total}} selected, {{count}} on current page'
        });

        t.switch('de');
    });

    afterEach(() => {
        t = undefined as any;
    });

    describe('use "t" as function for translating', () => {
        test('should translate keys', () => {
            expect(t('first_name')).toEqual('Vorname');
            expect(t('last_name')).toEqual('Nachname');

            t.switch('en');

            expect(t('first_name')).toEqual('First name');
            expect(t('last_name')).toEqual('Last name');
        });
    });

    describe('use "t" as api for formatting', () => {
        test('should translate key and interpolate values', () => {
            const fixture = {
                firstName: 'Vitaliy',
                lastName: 'Parkhomenko',
                position: 'developer'
            };

            expect(t.format('template-string', {
                firstName: fixture.firstName,
                lastName: fixture.lastName,
                position: t(fixture.position)
            }))
                .toEqual('Ich heiße Vitaliy Parkhomenko. Ich bin Frontend-Entwickler.');

            t.switch('en');

            expect(t.format('template-string', {
                firstName: fixture.firstName,
                lastName: fixture.lastName,
                position: t(fixture.position)
            }))
                .toEqual('My name is Vitaliy Parkhomenko. I am a Frontend developer.');
        });

        test('should not crash if value is empty (0, empty string)', () => {
            expect(t.format('selected-on-page', {
                total: 15,
                count: 0
            }))
                .toEqual('15 Einträge ausgewählt, 0 auf aktueller Seite');

            t.switch('en');

            expect(t.format('selected-on-page', {
                total: 15,
                count: 0
            }))
                .toEqual('15 selected, 0 on current page');
        });

        test('should not crash and return back template from string if value wasn\'t passed', () => {
            const fixture = {
                firstName: 'Vitaliy',
                lastName: 'Parkhomenko'
            };

            expect(t.format('template-string', {
                firstName: fixture.firstName,
                lastName: fixture.lastName
            }))
                .toEqual('Ich heiße Vitaliy Parkhomenko. Ich bin {{position}}.');

            t.switch('en');

            expect(t.format('template-string', {
                firstName: fixture.firstName,
                lastName: fixture.lastName
            }))
                .toEqual('My name is Vitaliy Parkhomenko. I am a {{position}}.');
        });
    });

    describe('use "t" as function for look at the current language', () => {
        test('should return switched language', () => {
            expect(t.lang()).toBe('de');

            t.switch('en');

            expect(t.lang()).toBe('en');
        });
    });

    describe('use "t" as function for look at the registered languages', () => {
        test('should return registered languages array', () => {
            expect(t.list()).toEqual(['de', 'en']);

            t.switch('en');

            expect(t.list()).toEqual(['de', 'en']);
        });
    });

    describe('use "t" as function for subscribe to listen to language changes', () => {
        test('should call subscription function', () => {
            const subscriber = jest.fn();

            t.subscribe(subscriber);

            // switch to another language
            t.switch('en');

            expect(subscriber).toHaveBeenCalledTimes(1);

            // switch to the same language
            t.switch('en');

            expect(subscriber).toHaveBeenCalledTimes(1);

            // switch to another language
            t.switch('de');

            expect(subscriber).toHaveBeenCalledTimes(2);
        });
    });

    describe('use "t" as function for subscribe to listen to language changes call unsubscribe', () => {
        test('unsubscribe to listen to language changes', () => {
            const subscriber1 = jest.fn();
            const subscriber2 = jest.fn();

            const unsubscribe1 = t.subscribe(subscriber1);
            const unsubscribe2 = t.subscribe(subscriber2);

            expect((t as any)._sub()).toEqual([subscriber1, subscriber2]);

            // switch to another language
            t.switch('en');

            // all subscribers were called
            expect(subscriber1).toHaveBeenCalledTimes(1);
            expect(subscriber2).toHaveBeenCalledTimes(1);

            // unsubscribe first
            unsubscribe1();

            // now only second subscriber
            expect((t as any)._sub()).toEqual([subscriber2]);

            // switch to another language
            t.switch('de');

            // only second subscribers was called
            expect(subscriber1).toHaveBeenCalledTimes(1);
            expect(subscriber2).toHaveBeenCalledTimes(2);

            // try unsubscribe first subscriber again
            expect(() => {
                unsubscribe1();
            }).not.toThrow();

            // still only second subscriber
            expect((t as any)._sub()).toEqual([subscriber2]);

            // unsubscribe second
            unsubscribe2();

            // no subscribers now
            expect((t as any)._sub()).toEqual([]);

            // switch to another language
            t.switch('en');

            // subscribers haven't been called after last changes
            expect(subscriber1).toHaveBeenCalledTimes(1);
            expect(subscriber2).toHaveBeenCalledTimes(2);

            // try unsubscribe second subscriber again
            expect(() => {
                unsubscribe2();
            }).not.toThrow();

            // still no subscribers
            expect((t as any)._sub()).toEqual([]);
        });
    });
});

describe('localization in not production mode', () => {
    const originalconsole = console.error;
    const mockedconsole = jest.fn();

    let t: ILocalizationApi;

    beforeEach(() => {
        console.error = mockedconsole;

        t = localization();

        t.register('de', {test: 'Test'});
        t.register('en', {test: 'Test'});
        t.switch('de');
    });

    afterEach(() => {
        console.error = originalconsole;

        t = undefined as any;
    });

    describe('try register language second time', () => {
        test('should log error to console', () => {
            t.register('en', {test: 'Test'});

            expect(mockedconsole).toHaveBeenCalledWith('localization: language "en" already registered.');
        });
    });

    describe('try translate key which is not exist in translations', () => {
        test('should log error to console', () => {
            expect(t('unknown')).toEqual('@missing_namespace[unknown]');

            expect(mockedconsole).toHaveBeenCalledWith('localization: missing translation for "unknown" in language "de".');
        });

        test('should not log if namespace is exist and translate', () => {
            expect(t('test')).toEqual('Test');

            expect(mockedconsole).not.toHaveBeenCalled();
        });
    });

    describe('try switch to unregistered language', () => {
        test('should log error to console', () => {
            t.switch('ru');

            expect(mockedconsole).toHaveBeenCalledWith('localization: missing language "ru" in registry.');
        });
    });

    describe('try translate key by language which is not exist registry', () => {
        test('should log error to console', () => {
            t.switch('ru');

            expect(t('test')).toEqual('@missing_language[ru]');

            expect(mockedconsole).toHaveBeenCalledWith('localization: missing language "ru" in registry.');
        });
    });

    describe('try subscribe with listener which is not a function', () => {
        test('should log error to console', () => {
            t.subscribe(jest.fn);

            expect(mockedconsole).not.toHaveBeenCalledWith('localization: expected the listener to be a function.');

            t.subscribe({} as any);

            expect(mockedconsole).toHaveBeenCalledWith('localization: expected the listener to be a function.');
        });
    });
});
