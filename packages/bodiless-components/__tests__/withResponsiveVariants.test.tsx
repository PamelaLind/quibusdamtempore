/**
 * Copyright © 2021 Johnson & Johnson
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

import React, { ComponentType } from 'react';
import ReactDOMServer from 'react-dom/server';
import flow from 'lodash/flow';
// eslint-disable-next-line import/no-extraneous-dependencies
import cheerio from 'cheerio';
import { replaceWith, withDesign } from '@bodiless/fclasses';
import withResponsiveVariants from '../src/withResponsiveVariants';
// eslint-disable-next-line import/order
import { mount } from 'enzyme';

const defaultPageDimensions = {
  height: 0,
  width: 0,
  size: 'sm',
};

const MockPageDimensionsContext = React.createContext(defaultPageDimensions);

jest.mock('../src/PageDimensionsProvider', () => ({
  usePageDimensionsContext: () => React.useContext(MockPageDimensionsContext),
  withPageDimensionsContext: () => (
    Component: ComponentType<any>,
  ) => ({ pageDimensions = defaultPageDimensions, ...rest }: any) => (
    <MockPageDimensionsContext.Provider value={pageDimensions}>
      <Component {...rest} />
    </MockPageDimensionsContext.Provider>
  ),
}));

describe('withResponsiveVariants', () => {
  const Small = () => <span id="small">small</span>;
  const Medium = () => <span id="medium">medium</span>;
  const Large = () => <span id="large">large</span>;
  const breakpoints = { sm: 0, md: 100, lg: 200 };

  const Test = flow(
    withResponsiveVariants({ breakpoints }),
    withDesign({
      md: replaceWith(Medium),
      lg: replaceWith(Large),
    }),
  )(Small);

  it('Renders all variants on server', () => {
    const server = ReactDOMServer.renderToString(<Test />);
    const $ = cheerio.load(server);
    expect($('span#small').text()).toBe('small');
    expect($('span#medium').text()).toBe('medium');
    expect($('span#large').text()).toBe('large');
  });

  it('Renders only the appropriate variant on client', () => {
    const wrapper = mount(<Test />);
    expect(wrapper.find('span#small').text()).toBe('small');
    expect(wrapper.find('span#medium')).toHaveLength(0);
    expect(wrapper.find('span#large')).toHaveLength(0);
  });

  it('Responds to changes in viewport', () => {
    const medium = {
      height: 100,
      width: 100,
      size: 'md',
    };
    const large = {
      height: 200,
      width: 200,
      size: 'lg',
    };
    const wrapper = mount(<Test pageDimensions={medium} />);
    expect(wrapper.find('span#medium').text()).toBe('medium');
    wrapper.setProps({ pageDimensions: large });
    expect(wrapper.find('span#medium')).toHaveLength(0);
    expect(wrapper.find('span#large').text()).toBe('large');
  });
});
