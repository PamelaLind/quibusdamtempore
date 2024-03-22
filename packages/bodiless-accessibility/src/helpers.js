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
import { existsSync, readFileSync } from 'fs';
import cliReporter from 'pa11y-reporter-cli';
import arg from 'arg';
import chalk from 'chalk';
import { extractUrls } from 'sitemap-urls';

/* eslint-disable no-useless-escape */
const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
const newLineRE = /\r?\n|\r/g;
/* eslint-enable no-useless-escape */

export const logScanResults = results => console.log(cliReporter.results(results));

export const parseArguments = rawArgs => {
  const args = arg(
    {
      '--url': String,
      '--file': String,
    },
    {
      argv: rawArgs.slice(2),
    },
  );

  return {
    url: args['--url'] || false,
    filePath: args['--file'] || false,
  };
};

export const getUrlsFromFile = path => {
  if (existsSync(path)) {
    try {
      const XMLData = readFileSync(path);
      const parsedXml = extractUrls(XMLData).map(url => url.replace(newLineRE, '').trim());

      return parsedXml;
    } catch (err) {
      console.error(chalk.red.bold(`Can not read file at "${path}"`), err);
    }
  } else {
    console.error(chalk.red.bold(`Can not find file at "${path}"`));
  }

  return [];
};

export const isValidUrl = string => {
  if (typeof string !== 'string') {
    return false;
  }

  const match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (localhostDomainRE.test(everythingAfterProtocol)
    || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }

  return false;
};
