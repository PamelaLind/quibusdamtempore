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

/* eslint-disable global-require */

export {};
let fs = require('fs');
let pathUtil = require('path');

describe('psh url replacer', () => {
  beforeEach(() => {
    jest.resetModules();
    fs = require('fs');
    jest.mock('fs');
    pathUtil = require('path');
    process.env.PSH_URL_REPLACER_SRC_FILE = 'src/foo.txt';
    process.env.PSH_URL_REPLACER_TMP_FILE = 'tmp/foo.txt';
    process.env.PSH_URL_REPLACER_TARGET_FILE = 'public/foo.txt';
    process.env.PSH_URL_REPLACER_SRC_URL = 'www.example.com';
    process.env.PSH_URL_REPLACER_TARGET_URL = 'test.example.com';
  });
  describe('during build phase', () => {
    describe('when src file exists', () => {
      beforeEach(() => {
        fs.existsSync.mockImplementation((path$: string) => {
          if (path$ === process.env.PSH_URL_REPLACER_SRC_FILE) {
            return true;
          }
          return false;
        });
      });
      it('should copy src file to tmp file', () => {
        const pshUrlReplacer = require('../src/psh-url-replacer');
        pshUrlReplacer.main('build');
        expect(fs.rename.mock.calls[0][0]).toBe(process.env.PSH_URL_REPLACER_SRC_FILE);
        expect(fs.rename.mock.calls[0][1]).toBe(process.env.PSH_URL_REPLACER_TMP_FILE);
      });
      it('should create symlink to the target file', () => {
        const pshUrlReplacer = require('../src/psh-url-replacer');
        fs.rename.mockImplementation(
          (oldPath: any, newPath: any, callback: Function) => {
            callback(undefined);
          },
        );
        pshUrlReplacer.main('build');
        expect(fs.symlink.mock.calls[0][0]).toBe(
          process.env.PSH_URL_REPLACER_TARGET_FILE,
        );
        expect(fs.symlink.mock.calls[0][1]).toBe(
          process.env.PSH_URL_REPLACER_SRC_FILE,
        );
      });
    });
    describe('when src file does not exist', () => {
      beforeEach(() => {
        fs.existsSync.mockImplementation((path$: string) => {
          if (path$ === process.env.PSH_URL_REPLACER_SRC_FILE) {
            return false;
          }
          return false;
        });
      });
      it('should not be moved and symlinked', () => {
        expect(fs.rename).toHaveBeenCalledTimes(0);
        expect(fs.symlink).toHaveBeenCalledTimes(0);
      });
    });
  });
  describe('during deploy phase', () => {
    const mockSrcFile = (file: string) => {
      fs.readFile.mockImplementation(
        (path$: string, encoding: string, callback: Function) => {
          if (path$ === process.env.PSH_URL_REPLACER_TMP_FILE) {
            const srcPath = pathUtil.join(
              __dirname,
              `fixtures/${file}`,
            );
            const fileContent = jest
              .requireActual('fs')
              .readFileSync(srcPath)
              .toString();
            callback(undefined, fileContent);
          }
        },
      );
    };

    const readExpectedFile = (file: string) => {
      const targetPath = pathUtil.join(
        __dirname,
        `fixtures/${file}`,
      );
      return jest
        .requireActual('fs')
        .readFileSync(targetPath)
        .toString();
    };

    describe('when tmp file exists', () => {
      beforeEach(() => {
        fs.existsSync.mockImplementation((path$: string) => {
          if (path$ === process.env.PSH_URL_REPLACER_TMP_FILE) {
            return true;
          }
          return false;
        });
      });
      describe('when the environment is not production', () => {
        describe('when a txt file processed', () => {
          it('should read from the tmp file and perform url replacement', () => {
            mockSrcFile('robotstxt/source.txt');
            const pshUrlReplacer = require('../src/psh-url-replacer');
            pshUrlReplacer.main('deploy');
            expect(fs.writeFile.mock.calls[0][0]).toBe(
              process.env.PSH_URL_REPLACER_TARGET_FILE,
            );
            const expectedContent = readExpectedFile('robotstxt/expected.txt');
            expect(fs.writeFile.mock.calls[0][1]).toBe(expectedContent);
          });
        });
        describe('when an xml file processed', () => {
          it('should read from the tmp file and perform url replacement', () => {
            mockSrcFile('sitemapxml/source.xml');
            const pshUrlReplacer = require('../src/psh-url-replacer');
            pshUrlReplacer.main('deploy');
            expect(fs.writeFile.mock.calls[0][0]).toBe(
              process.env.PSH_URL_REPLACER_TARGET_FILE,
            );
            const expectedContent = readExpectedFile('sitemapxml/expected.xml');
            expect(fs.writeFile.mock.calls[0][1]).toBe(expectedContent);
          });
        });
      });
      describe('when the environment is production', () => {
        beforeEach(() => {
          process.env.PSH_URL_REPLACER_PROD_ENV = '1';
        });
        it('should not change source file', () => {
          mockSrcFile('robotstxt/source.txt');
          const pshUrlReplacer = require('../src/psh-url-replacer');
          pshUrlReplacer.main('deploy');
          expect(fs.writeFile.mock.calls[0][0]).toBe(
            process.env.PSH_URL_REPLACER_TARGET_FILE,
          );
          const expectedContent = readExpectedFile('robotstxt/source.txt');
          expect(fs.writeFile.mock.calls[0][1]).toBe(expectedContent);
        });
      });
    });
    describe('when tmp file does not exist', () => {
      beforeEach(() => {
        fs.existsSync.mockImplementation((path$: string) => {
          if (path$ === process.env.PSH_URL_REPLACER_TMP_FILE) {
            return false;
          }
          return false;
        });
      });
      it('should not be written', () => {
        expect(fs.writeFile).toHaveBeenCalledTimes(0);
      });
    });
  });
});
