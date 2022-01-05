import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import localization, {ILocalizationApi} from '../../core/localization';
import Provider from '../Provider';
import withTranslate, {ITranslateComponentProps} from '../with-translate';

describe('withTranslate', () => {
  let api: ILocalizationApi;

  beforeEach(() => {
    api = localization();

    api.register('de', {firstName: 'Vorname'});
    api.register('en', {firstName: 'First name'});

    api.switch('de');
  });

  test('should provide translate api to component and update component on change language', () => {
    const Test = withTranslate((props: ITranslateComponentProps) => {
      const {t} = props;
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
    });
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
