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

import React, { ComponentType as CT } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { shallow } from 'enzyme';

jest.mock('../src/components/BVLoader');
jest.mock('../src/components/asBVComponent', () => ({
  asDesignableBVComponent: () => (Component: CT) => (props: any) => <Component {...props} />,
}));
jest.mock('../src/components/asEditableBV');

const creatBVRatingsSummary = () => {
  let BVRatingsSummary;
  // @ts-ignore no types defined for jest.isolateModules
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require,prefer-destructuring
    BVRatingsSummary = require('../src/components/v2/BVRatingsSummary').BVRatingsSummaryBase;
  });
  return BVRatingsSummary;
};

describe('bv ratings summary', () => {
  it('renders according to BV specification', () => {
    const BVRatingsSummary = creatBVRatingsSummary();
    // @ts-ignore
    const wrapper = shallow(<BVRatingsSummary productId="123" />);
    expect(wrapper.html()).toBe('<div data-bv-show="rating_summary" data-bv-product-id="123"></div>');
  });
});
