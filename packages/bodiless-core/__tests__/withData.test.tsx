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
import { shallow } from 'enzyme';
import withData from '../src/withData';

describe('withData', () => {
  it('passes all members of componentData as props', () => {
    const data = {
      foo: Math.random().toString(),
      bar: Math.random().toString(),
    };
    const Div = withData('div');
    const wrapper = shallow(<Div componentData={data} />);
    expect(wrapper.prop('foo')).toBe(data.foo);
    expect(wrapper.prop('bar')).toBe(data.bar);
  });
});
