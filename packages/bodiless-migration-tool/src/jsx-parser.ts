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

/* eslint no-param-reassign: 1 */
import * as generator from '@babel/generator';
import * as parser from '@babel/parser';
import * as traverse from '@babel/traverse';
import * as prettier from 'prettier';
import {
  JSXIdentifier,
  JSXOpeningElement,
  JSXClosingElement,
} from '@babel/types';

function getJSXElementName<T extends JSXOpeningElement | JSXClosingElement>(jsxElement: T): string {
  const jSXIdentifier = (jsxElement.name as JSXIdentifier);
  return jSXIdentifier.name || '';
}

function replaceJSXElementName<T extends JSXOpeningElement | JSXClosingElement>(
  jsxElement: T,
  newElement: string,
): T {
  const jSXIdentifier = (jsxElement.name as JSXIdentifier);
  if (jSXIdentifier.name) {
    jSXIdentifier.name = newElement;
  }
  return jsxElement;
}

export function replaceRootJsxElement(jsx: string, newElement: string): string {
  const ast = parser.parse(jsx, { plugins: ['jsx'] });
  traverse.default(ast, {
    JSXElement(path) {
      if (path.parent.type !== 'JSXElement') {
        path.node.openingElement = replaceJSXElementName<JSXOpeningElement>(
          path.node.openingElement,
          newElement,
        );
        if (path.node.closingElement) {
          path.node.closingElement = replaceJSXElementName<JSXClosingElement>(
            path.node.closingElement,
            newElement,
          );
        }
        path.stop();
      }
    },
  });
  return generator.default(ast).code;
}

export function renameJsxElement(jsx: string, elementName: string, newElementName: string): string {
  const ast = parser.parse(jsx, { plugins: ['jsx'] });
  traverse.default(ast, {
    JSXElement(path) {
      const openingElementName = getJSXElementName<JSXOpeningElement>(path.node.openingElement);
      if (openingElementName === elementName) {
        path.node.openingElement = replaceJSXElementName<JSXOpeningElement>(
          path.node.openingElement,
          newElementName,
        );
        if (path.node.closingElement) {
          const closingElementName = getJSXElementName<JSXClosingElement>(path.node.closingElement);
          if (closingElementName === elementName) {
            path.node.closingElement = replaceJSXElementName<JSXClosingElement>(
              path.node.closingElement,
              newElementName,
            );
          }
        }
        path.stop();
      }
    },
  });
  return generator.default(ast).code;
}

export function formatJsx(jsx: string): string {
  return prettier.format(jsx, {
    parser: 'babel',
  });
}
