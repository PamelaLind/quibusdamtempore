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

const replace = require('replace-in-file');
const getSSIEntities = require('./read-ssi-entities');

/**
 * Called after all other parts of the build process are complete
 * ssi elements, that were inserted during onPreRenderHTML phase,
 * will replaced with ssi comments
 */
exports.onPostBuild = (_, pluginOptions) => {
  const ssiEntities = getSSIEntities(pluginOptions.ssiConfPath);
  const from = [];
  const to = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.keys(ssiEntities).forEach((ssiEntityKey, value) => {
    if (ssiEntities[ssiEntityKey].pragma) {
      from.push(
        new RegExp(
          // eslint-disable-next-line no-useless-escape
          `<ssi-element-${ssiEntityKey}>(.*?)<\/ssi-element-${ssiEntityKey}>`,
        ),
      );
      to.push(ssiEntities[ssiEntityKey].pragma);
    }
  });
  if (from.length > 0 && to.length > 0) {
    const files = ['./public/**/*.html', './public/*.html'];
    replace.sync({
      files,
      from,
      to,
    });
  }
};
