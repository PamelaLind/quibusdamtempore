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

/* eslint no-console: 0 */
import chalk from 'chalk';
import pa11y from 'pa11y';
import ora from 'ora';

import {
  parseArguments,
  isValidUrl,
  getUrlsFromFile,
  logScanResults,
} from './helpers';

/* eslint-disable import/prefer-default-export */
export async function audit(args) {
  const { url, filePath } = parseArguments(args);
  const loadingSpinner = ora('Waiting for the scan results...');

  if (filePath) {
    const urls = getUrlsFromFile(filePath);

    console.log(chalk.green.bold(`URLs from "${filePath}":`));
    urls.forEach(urlFromXml => console.log(chalk.green(urlFromXml)));

    loadingSpinner.start();

    try {
      const scanResults = await Promise.all(urls.map(async urlFromXml => pa11y(urlFromXml)));
      scanResults.forEach(result => logScanResults(result));

      loadingSpinner.succeed('All Pages Have Been Scanned!');
    } catch (err) {
      loadingSpinner.fail('Something went wrong.');
      console.error(err);
    }
  } else if (url && isValidUrl(url)) {
    loadingSpinner.start(`Running audit against a single page: ${url}`);

    try {
      const scanResults = await pa11y(url);
      logScanResults(scanResults);

      loadingSpinner.succeed('All Pages Have Been Scanned!');
    } catch (err) {
      loadingSpinner.fail('Something went wrong.');
      console.error(err);
    }
  } else {
    console.error(chalk.red.bold('Invalid Arguments'));
    console.error(chalk.green('Usage:'));
    console.error(chalk.green('"pa11y-audit --file=/path/to/sitemap.xml"'));
    console.error(chalk.green('"pa11y-audit --url=http://example.com/"'));
  }
}
