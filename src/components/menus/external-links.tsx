import {faDiscord, faGithub} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import {HelixLogo, VIALogo} from '../icons/via';
import {CategoryMenuTooltip} from '../inputs/tooltip';
import {CategoryIconContainer} from '../panes/grid';

const ExternalLinkContainer = styled.span`
  position: absolute;
  right: 1em;
  display: flex;
  gap: 1em;
`;

const ExternalLinkContainer_helix = styled.span`
  position: absolute;
  left: 1em;
  display: flex;
  gap: 1em;
`;

export const ExternalLinks_helix = () => (
  <ExternalLinkContainer_helix>
    <a href="https://docs.helix.site" target="_blank">
      <CategoryIconContainer>
        <HelixLogo height="30px" fill="currentColor" />
        <CategoryMenuTooltip>Docs</CategoryMenuTooltip>
      </CategoryIconContainer>
    </a>
  </ExternalLinkContainer_helix>
);


export const ExternalLinks = () => (
  <ExternalLinkContainer>
    <a href="https://caniusevia.com/" target="_blank">
      <CategoryIconContainer>
        <VIALogo height="25px" fill="currentColor" />
        <CategoryMenuTooltip>Docs</CategoryMenuTooltip>
      </CategoryIconContainer>
    </a>
  </ExternalLinkContainer>
);
