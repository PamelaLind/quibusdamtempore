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

import HtmlParser from './html-parser';

type AttrTransformerConfig = {
  namespaces: {[attr: string]: string},
  attributes: {[attr: string]: string}
};

export enum AttrTransformerDirecton {
  Direct = 'direct',
  Reverse = 'reverse'
}

const attrTransformerRules: AttrTransformerConfig = {
  namespaces: {
    'xmlns:': 'fakexmlns',
  },
  attributes: {
    onclick: 'fakeonclick',
  },
};

export function replaceAttributes(input: string, direction: AttrTransformerDirecton): string {
  const htmlParser = new HtmlParser(input);

  htmlParser.manipulateAttributes((oldAttr: string) => {
    const { namespaces } = attrTransformerRules;
    let newAttrName = oldAttr;
    Object.keys(namespaces).forEach(nsKey => {
      const original = direction === AttrTransformerDirecton.Direct ? nsKey : namespaces[nsKey];
      const fake = direction === AttrTransformerDirecton.Direct ? namespaces[nsKey] : nsKey;
      if (oldAttr.startsWith(original)) {
        newAttrName = oldAttr.replace(original, fake);
      }
    });

    const { attributes } = attrTransformerRules;
    Object.keys(attributes).forEach(attrKey => {
      const isDirect = direction === AttrTransformerDirecton.Direct;
      const original = isDirect ? attrKey : attributes[attrKey];
      const fake = isDirect ? attributes[attrKey] : attrKey;
      if (oldAttr === original) {
        newAttrName = fake;
      }
    });

    return newAttrName;
  });

  return htmlParser.getPageHtml();
}
