import '@testing-library/jest-dom/extend-expect';
import * as ReactTestingLibrary from '@testing-library/react';
import { FakeApiClient } from 'src/testSupport/fakeApiClient';

ReactTestingLibrary.configure({ testIdAttribute: 'data-qa' });

jest.setTimeout(30000);

// @ts-ignore
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };

afterEach(async () => {
  ReactTestingLibrary.cleanup();
  (await FakeApiClient).clear();
});