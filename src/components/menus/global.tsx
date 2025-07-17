import React from 'react';
import styled from 'styled-components';
import {ErrorLink} from '../panes/errors';
import {ExternalLinks, ExternalLinks_helix} from './external-links';

const Container = styled.div`
  width: 100vw;
  height: 30px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border_color_cell);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GlobalContainer = styled(Container)`
  background: var(--bg_outside-accent);
  column-gap: 20px;
`;

export const UnconnectedGlobalMenu = () => {
  return (
    <React.Fragment>
      <GlobalContainer>
        <ErrorLink />
        <ExternalLinks_helix />
        <ExternalLinks />
      </GlobalContainer>
    </React.Fragment>
  );
};
