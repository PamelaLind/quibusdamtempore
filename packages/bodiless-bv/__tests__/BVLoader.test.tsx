/**
 * Copyright © 2019 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { BVLoaderProvider, useBVLoader } from '../src/components/BVLoader';

describe('BVLoader', () => {
  // we want to clear JSDOM document after each test run
  // as far as it only clears the DOM after all tests inside an entire file are completed.
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });
  const bvMainScriptUrl = 'https://www.bvexample.com/main.js';
  const getBVScriptFromDom = () => document.querySelectorAll(`script[src='${bvMainScriptUrl}']`);
  it('adds bv main script to head', () => {
    expect(getBVScriptFromDom().length).toBe(0);
    mount(<BVLoaderProvider scriptUrl={bvMainScriptUrl} />);
    expect(getBVScriptFromDom().length).toBe(1);
  });
  it('adds bv main script only once', () => {
    expect(getBVScriptFromDom().length).toBe(0);
    mount(<BVLoaderProvider scriptUrl={bvMainScriptUrl} />);
    mount(<BVLoaderProvider scriptUrl={bvMainScriptUrl} />);
    expect(getBVScriptFromDom().length).toBe(1);
  });
  it('changes to loaded once $BV object is initialized', () => {
    const isLoadedMockFn = jest.fn();
    const Foo = () => {
      const { isLoaded } = useBVLoader();
      isLoadedMockFn(isLoaded);
      return <></>;
    };
    jest.useFakeTimers();
    mount(<BVLoaderProvider scriptUrl={bvMainScriptUrl}><Foo /></BVLoaderProvider>);
    expect(isLoadedMockFn.mock.calls[0][0]).toBe(false);
    // @ts-ignore
    window.$BV = { fakePropety: 'fakeValue' };
    act(() => {
      jest.runAllTimers();
    });
    expect(isLoadedMockFn.mock.calls[1][0]).toBe(true);
  });
});
