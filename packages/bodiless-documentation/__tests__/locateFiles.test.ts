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

import path from 'path';
import fs from 'fs-extra';
import locateFiles from '../src/locateFiles';

describe('locateFiles', () => {
  const testPath = '/tmp/dbalf';
  const deepPath = path.join(testPath, 'deep');
  const doc1 = path.join(testPath, 'doc1.docs.json');
  const doc2 = path.join(deepPath, 'doc2.docs.json');
  beforeEach(() => {
    fs.removeSync(testPath);
    fs.mkdirSync(testPath);
    fs.mkdirSync(deepPath);
    fs.closeSync(fs.openSync(doc1, 'w'));
    fs.closeSync(fs.openSync(doc2, 'w'));
  });
  it('should return abs paths to matching files at any depth', (done:Function) => {
    const filePattern = /.*docs.json/;
    type Result = {
      [key: string]: string;
    };
    locateFiles({
      filePattern,
      startingRoot: testPath,
      action: (filePath:string) => Promise.resolve(filePath),
    }).then((results:string[]) => {
      expect(results).toStrictEqual([
        doc1,
        doc2,
      ]);
      done();
    });
  });
});
