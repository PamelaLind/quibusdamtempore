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
import http from 'http';
import mime from 'mime';
import path from 'path';
import url from 'url';

export default class TestServer {
  static async create(dirPath: string, port: number) {
    const server = new TestServer(dirPath, port);
    return server;
  }

  server: http.Server

  dirPath: string

  startTime: Date

  constructor(dirPath: string, port: number) {
    this.server = http.createServer(this.onRequest.bind(this));
    this.server.listen(port);
    this.dirPath = dirPath;

    this.startTime = new Date();
  }

  async start() {
    await new Promise(x => this.server.once('listening', x));
  }

  async stop() {
    await new Promise(x => this.server.close(x));
  }

  serveFile(request: http.IncomingMessage, response: http.ServerResponse, pathName: string) {
    const pathName1 = pathName === '/' ? '/index.html' : pathName;
    const filePath = path.join(this.dirPath, pathName1.substring(1));

    fs.readFile(filePath, (err, data) => {
      if (err) {
        TestServer.notFoundResponse(response, `file not found: ${filePath}`);
        return;
      }
      const mimeType = mime.getType(filePath);
      if (mimeType === null) {
        TestServer.notFoundResponse(response, `undefined mimeType: ${filePath}`);
        return;
      }
      const isTextEncoding = /^text\/|^application\/(javascript|json)/.test(mimeType);
      const contentType = isTextEncoding ? `${mimeType}; charset=utf-8` : mimeType;
      response.setHeader('Content-Type', contentType);
      response.end(data);
    });
  }

  onRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    request.on('error', () => {
      // if (error.code === 'ECONNRESET')
      //  response.end();
      // else
      response.end();
    });
    /* request.postBody = new Promise(resolve => {
      let body = '';
      request.on('data', chunk => body += chunk);
      request.on('end', () => resolve(body));
    }); */
    if (request.url === undefined) {
      throw new Error('undefined request url');
    }
    const pathName = url.parse(request.url).path;
    if (pathName === undefined) {
      throw new Error('undefined path name');
    }
    this.serveFile(request, response, pathName);
  }

  static notFoundResponse(response: http.ServerResponse, message: string) {
    response.statusCode = 404;
    response.end(message);
  }
}
