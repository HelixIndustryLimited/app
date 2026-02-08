import React from 'react';
import styled from 'styled-components';
import { ErrorLink } from '../panes/errors';
import { ExternalLinks, ExternalLinks_helix } from './external-links';

const Container = styled.div`
  width: 100vw;
  height: 30px;
  padding: 12px 0;
  border-bottom: 1px solid rgb(50, 50, 50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GlobalContainer = styled(Container)`
  background: rgba(16, 16, 16, 1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  column-gap: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
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
