/**
 * Copyright © 2020 Johnson & Johnson
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

import React, {
  FC,
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
import throttle from 'lodash/throttle';
import { Token } from '@bodiless/fclasses';

type PageDimensions = {
  width: number,
  height: number,
  size: string,
};

export type BreakpointsType = {
  [size: string]: number;
};

export type PageDimensionsProviderProps = {
  breakpoints?: BreakpointsType,
};

const PageDimensionsContext = createContext<PageDimensions>({
  width: 0,
  height: 0,
  size: 'sm',
});

const mapBreakpointsSize = (breakpoints: BreakpointsType = {}, width: number) => (
  Object.keys(breakpoints).slice().reverse().find(item => width >= breakpoints[item]) || '_default'
);

const usePageDimensionsContext = () => useContext(PageDimensionsContext);

const getDimensions = (breakpoints?: BreakpointsType): PageDimensions => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      size: mapBreakpointsSize(breakpoints, window.innerWidth),
    };
  }

  return { width: 0, height: 0, size: 'sm' };
};

const PageDimensionsProvider: FC<PageDimensionsProviderProps> = ({ children, breakpoints }) => {
  const [dimensions, setDimensions] = useState<PageDimensions>(getDimensions(breakpoints));

  useEffect(() => {
    let isRendered = true;
    const handleResize = () => {
      if (isRendered) {
        setDimensions(getDimensions(breakpoints));
      }
    };
    window.addEventListener('resize', throttle(handleResize, 100));
    return () => {
      isRendered = false;
      window.removeEventListener('resize', throttle(handleResize, 100));
    };
  }, []);

  return (
    <PageDimensionsContext.Provider value={dimensions}>
      { children }
    </PageDimensionsContext.Provider>
  );
};

/**
 * Adds a context which provides the current viewport size as well as the
 * breakpoint to which it maps.
 *
 * @param breakpoints A list of breakpoints to define the mapping.
 *
 * @return HOC which wraps a component with the context provider.
 */
const withPageDimensionsContext = (
  { breakpoints }: PageDimensionsProviderProps,
): Token => Component => {
  const WithPageDimensionsContext: FC<any> = props => (
    <PageDimensionsProvider breakpoints={breakpoints}>
      <Component {...props} />
    </PageDimensionsProvider>
  );
  return WithPageDimensionsContext;
};

export default PageDimensionsProvider;
export {
  withPageDimensionsContext,
  usePageDimensionsContext,
};
