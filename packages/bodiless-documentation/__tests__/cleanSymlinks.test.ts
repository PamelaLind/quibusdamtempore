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
import cleanSymlinks from '../lib/cleanSymlinks';

describe('cleanSymlinks', () => {
  const testPath = '/tmp/bda';
  const testDocPath = path.join(testPath, 'docs');
  const testTargetPath = path.join(testPath, 'targets');
  const symlinkTarget = path.join(testTargetPath, 'target1');
  const symlink = path.join(testDocPath, 'symlink1');
  beforeEach(() => {
    fs.removeSync(testPath);
    fs.mkdirSync(testPath);
    fs.mkdirSync(testDocPath);
    fs.mkdirSync(testTargetPath);
    fs.closeSync(fs.openSync(symlinkTarget, 'w'));
    fs.symlinkSync(symlinkTarget, symlink);
  });
  afterEach(() => {
    fs.removeSync(testPath);
  });
  it('should remove all symlinks', async (done:Function) => {
    await cleanSymlinks(testDocPath, []).then(() => {
      expect(fs.existsSync(symlink)).toBe(false);
      done();
    });
  });
  it('should not remove files that are not symlinks', async (done:Function) => {
    const doNotRemove = path.join(testDocPath, 'doNotRemove');
    fs.closeSync(fs.openSync(doNotRemove, 'w'));
    await cleanSymlinks(testDocPath, []).then(() => {
      expect(fs.existsSync(doNotRemove)).toBe(true);
      done();
    });
  });
  it('should not remove filtered symlinks', async (done:Function) => {
    const testDocSafePath = path.join(testDocPath, 'safe');
    const safeSymlink = path.join(testDocSafePath, 'safelink');
    fs.mkdirSync(testDocSafePath);
    fs.symlinkSync(symlinkTarget, safeSymlink);
    await cleanSymlinks(testDocPath, ['safe']).then(() => {
      expect(fs.existsSync(safeSymlink)).toBe(true);
      done();
    });
  });
});
