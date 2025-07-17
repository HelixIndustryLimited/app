import styled from 'styled-components';

type AccentButtonProps = {
  disabled?: boolean;
  onClick?: (...a: any[]) => void;
};

const AccentButtonBase = styled.button<AccentButtonProps>`
  height: 40px;
  padding: 0 15px;
  line-height: 40px;
  min-width: 100px;
  text-align: center;
  outline: none;
  font-size: 16px;
  border-radius: 12px;
  color: var(--color_accent);
  border: none;
  display: inline-block;
  box-sizing: border-box;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: color 0.2s ease;

  &:hover {
    border: none;
  }
`;
export const AccentButton = styled(AccentButtonBase)`
  background-color: ${(props) =>
    props.disabled ? 'var(--bg_control-disabled)' : '#121212'};
  color: ${(props) =>
    props.disabled ? 'var(--bg_control)' : 'white'};
  border: none;

  &:hover {
    color: ${(props) =>
      props.disabled ? 'var(--bg_control)' : '#ccc'};
  }
`;
export const AccentButtonLarge = styled(AccentButton)`
  font-size: 24px;
  line-height: 60px;
  height: 60px;
`;

export const PrimaryAccentButton = styled(AccentButtonBase)`
  color: ${(props) =>
    props.disabled ? 'var(--bg_control)' : '#151412'};
  border-color: ${(props) =>
    props.disabled ? 'var(--bg_control)' : 'var(--color_accent)'};
  background-color: ${(props) =>
    props.disabled ? 'transparent' : 'var(--color_accent)'};
  transition: filter 0.2s ease;
  &:hover {
    filter: brightness(0.9);
  }
`;
