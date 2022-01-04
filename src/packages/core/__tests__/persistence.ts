import {load, save, remove} from '../persistence';

describe('created localization', () => {
  afterEach(() => {
    (global as any).localStorage.clear();
  });

  test('try save', () => {
    save('en');

    expect((global as any).localStorage.getItem('locale')).toBe('en');
  });

  test('try load (storage is clear)', () => {
    expect(load()).toBeNull();
  });

  test('try load (storage has saved value)', () => {
    save('en');

    expect(load()).toBe('en');
  });

  test('try remove (storage has saved value)', () => {
    save('en');

    remove();

    expect((global as any).localStorage.getItem('locale')).toBeNull();
  });
});
