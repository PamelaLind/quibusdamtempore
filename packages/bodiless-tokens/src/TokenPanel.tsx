/**
 * Copyright © 2021 Johnson & Johnson
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

import React, { ComponentType, FC, HTMLProps } from 'react';
import {
  useEditContext,
} from '@bodiless/core';
import flow from 'lodash/flow';
import { observer } from 'mobx-react-lite';
import {
  DesignableComponentsProps, designable, StylableProps, Div,
} from '@bodiless/fclasses';
import { TMenuOption } from '@bodiless/core/src';
import type { TokenPanelPaneProps } from './TokenPanelPane';
import TokenPanelPane, { TOKEN_PANEL_CONTEXT_TYPE } from './TokenPanelPane';

type WithTokenPanelPanesProps = {
  panesProps: TokenPanelPaneProps[],
};

type TokenPanelPaneMenuOption = Omit<TMenuOption, 'handler'> & {
  handler: () => TokenPanelPaneProps,
};

const withTokenPanelPanesProps = <P extends object>(
  Component: ComponentType<P & WithTokenPanelPanesProps>,
) => {
  const WithTokenPanelPanesProps = observer((props: P) => {
    const context = useEditContext();
    const { contextMenuOptions } = context;
    const panesProps = (contextMenuOptions as TokenPanelPaneMenuOption[])
      .filter(op => op.context?.type === TOKEN_PANEL_CONTEXT_TYPE)
      .map((op): TokenPanelPaneProps => ({
        ...op.handler(),
        title: typeof op.label === 'function' ? op.label() : op.label,
      }));
    return <Component {...props} panesProps={panesProps} />;
  });
  return WithTokenPanelPanesProps;
};

export type TokenPanelComponents = {
  Panel: ComponentType<any>,
  Wrapper: ComponentType<any>,
  Empty: ComponentType<any>,
};

type TokenPanelProps = WithTokenPanelPanesProps & DesignableComponentsProps<TokenPanelComponents>;

const tokenPanelComponents: TokenPanelComponents = {
  Wrapper: 'div' as any,
  Panel: TokenPanelPane,
  Empty: (props: HTMLProps<HTMLDivElement> & StylableProps) => (
    <Div {...props}>
      No component selected
    </Div>
  ),
};

const TokenPanel: FC<TokenPanelProps> = props => {
  const { panesProps, components: C } = props;
  const content = (panesProps.length > 0)
    ? panesProps.map(p => <C.Panel {...p} key={p.node.path.join('$')} />)
    : <C.Empty />;
  return (
    <C.Wrapper data-bl-activator>
      {content}
    </C.Wrapper>
  );
};

export default flow(
  designable(tokenPanelComponents, 'TokenPanel'),
  withTokenPanelPanesProps,
)(TokenPanel);
