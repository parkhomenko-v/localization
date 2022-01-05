import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import {renderHook, act} from '@testing-library/react-hooks';
import localization, {ILocalizationApi} from '../../core/localization';
import Provider from '../Provider';
import useTranslate from '../use-translate';

describe('useTranslate', () => {
  let api: ILocalizationApi;

  beforeEach(() => {
    api = localization();

    api.register('de', {firstName: 'Vorname'});
    api.register('en', {firstName: 'First name'});

    api.switch('de');
  });

  test('hook should provide translate api', () => {
    const Wrapper = (props: any) => (
      <Provider api={api} >
        {props.children}
      </Provider>
    );

    const {result} = renderHook(() => useTranslate(), {wrapper: Wrapper});

    expect(result.current.lang()).toBe('de');
    expect(result.current.list()).toEqual(['de', 'en']);

    expect(result.current('firstName')).toBe('Vorname');

    act(() => {
      result.current.switch('en');
    });

    expect(result.current.lang()).toBe('en');
    expect(result.current.list()).toEqual(['de', 'en']);
    expect(result.current('firstName')).toBe('First name');
  });

  test('should update component', () => {
    const Test = () => {
      const t = useTranslate();
      const handleClick = () => {
        t.switch('en');
      };

      return (
        <div>
          <h1 data-testid="test-first-name">
            {t('firstName')}
          </h1>
          <button data-testid="test-button" onClick={handleClick}>
            Click
          </button>
        </div>
      );
    };
    const {getByTestId} = render(
      <Provider api={api} >
        <Test />
      </Provider>
    );

    expect(getByTestId('test-first-name').textContent).toBe('Vorname');

    fireEvent.click(getByTestId('test-button'));

    expect(getByTestId('test-first-name').textContent).toBe('First name');
  });
});
