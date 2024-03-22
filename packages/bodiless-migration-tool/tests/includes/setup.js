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

import crypto from 'crypto';
import * as path from 'path';
import { JamStackApp } from '../../src/jamstack-app';

const getRandomName = () => (
  crypto.randomBytes(20).toString('hex')
);

const getWorkingDirectory = () => (
  path.join(__dirname, '..', 'app')
);

const getRepository = () => 'https://github.com/johnsonandjohnson/bodiless-js.git';

const getJamStackApp = () => new JamStackApp(getWorkingDirectory());

const cleanRepository = () => {
  const jamStackApp = getJamStackApp();
  jamStackApp.cleanSync();
};

const beforeEach = () => {
  cleanRepository();
};

const afterEach = () => {
  cleanRepository();
};

export {
  getRandomName,
  getWorkingDirectory,
  getRepository,
  beforeEach,
  afterEach,
};
