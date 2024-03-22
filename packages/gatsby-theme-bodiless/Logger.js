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

/* eslint no-console: */
const axios = require('axios');

// Be careful when enabling this.  It will cause log messages from all
// browsers to be aggregated on the back-end.
const enabled = false;

// Our own small service to be used when running this through node.
class LoggerService {
  constructor(baseUrl = 'http://localhost:8001', prefix = '/___backend') {
    this.root = baseUrl;
    this.prefix = prefix;
  }

  get(resourcePath) {
    return axios.get(this.root + resourcePath);
  }

  post(resourcePath, data) {
    const url = `${this.root}${resourcePath}`;
    return axios.post(url, data);
  }

  log(data) {
    const fullPath = `${this.prefix}/log`;
    return this.post(fullPath, data);
  }
}
const loggerService = new LoggerService();

class Logger {
  constructor(prefix, service = loggerService) {
    this.prefix = prefix;
    this.service = service;
  }

  send(severity, message) {
    const body = {
      id: this.prefix,
      severity,
      message,
    };
    if (enabled) this.service.log(body);
    if (console) console.log(...message);
  }

  log(...message) {
    this.send('log', message);
  }

  warn(...message) {
    this.send('warn', message);
  }

  error(...message) {
    this.send('error', message);
  }
}

module.exports = Logger;
