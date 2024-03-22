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

import fs from 'fs';
import glob from 'glob';
import path from 'path';
// @ts-ignore
import htmlclean from 'htmlclean';
import postBuild from '../src/post-build';
import debug from '../src/debug';

beforeAll(() => {
  // https://github.com/facebook/jest/issues/5792
  // eslint-disable-next-line no-console
  debug('workaround to get logs inside functions');
});

beforeEach(() => {
  jest.clearAllMocks();
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe('attribute transformation after static site is generated', () => {
  test('transformation of fake attributes to their original name', () => {
    const staticSideDir = path.join(__dirname, 'public');
    jest.spyOn(fs, 'existsSync').mockImplementation((resource: fs.PathLike) => {
      switch (resource) {
        case path.join(staticSideDir, 'page-data'):
          return true;
        default:
          break;
      }
      if (resource.toString().endsWith('index.html')) {
        return true;
      }
      return false;
    });
    // @ts-ignore not obvious how to perform type casting here
    jest.spyOn(glob, 'sync').mockImplementation((pattern: string) => {
      if (pattern.endsWith('page-data.json')) {
        return [
          path.join(staticSideDir, 'page-data/products/page-data.json'),
          path.join(staticSideDir, 'page-data/about-us/page-data.json'),
        ];
      }
      return [];
    });
    jest.spyOn(fs, 'readFileSync').mockImplementation((resource: any) => {
      switch (resource) {
        case path.join(staticSideDir, 'page-data/products/page-data.json'):
          return '{"path": "/products"}';
        case path.join(staticSideDir, 'page-data/about-us/page-data.json'):
          return '{"path": "/about-us"}';
        case path.join(staticSideDir, 'products/index.html'):
          return `
            <html fakexmlnsfb="http://www.facebook.com">
              <head></head>
              <body>
                <div class="parent">
                  <header fakexmlnssomeattr>
                    <span class="child" fakexmlnshref="http://www.facebook.com"></span>
                    <div class="child2"></div>
                  </header>
                  <a fakeonclick="javascript:void()"></a>
                  <object fakeonclick></object>
                </div>
              </body>
            </html>
          `;
        default:
          break;
      }
      return '';
    });
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => true);
    const expectedHtml = `
      <html xmlns:fb="http://www.facebook.com">
        <head></head>
        <body>
          <div class="parent">
            <header xmlns:someattr>
              <span class="child" xmlns:href="http://www.facebook.com"></span>
              <div class="child2"></div>
            </header>
            <a onclick="javascript:void()"></a>
            <object onclick></object>
          </div>
        </body>
      </html>
    `;
    postBuild(staticSideDir);
    const receivedHtml = writeFileSyncSpy.mock.calls[0][1];
    expect(htmlclean(expectedHtml)).toBe(htmlclean(receivedHtml));
  });
  test('post-build throws exception if page data not found', () => {
    const staticSideDir = path.join(__dirname, 'public');
    jest.spyOn(fs, 'existsSync').mockImplementation((resource: fs.PathLike) => {
      if (resource === path.join(staticSideDir, 'page-data')) {
        return false;
      }
      return true;
    });
    expect(() => postBuild(staticSideDir)).toThrow();
  });
});
