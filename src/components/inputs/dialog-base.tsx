import styled from 'styled-components';

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

export const ModalContainer = styled.div`
  border: none
  min-width: 460px;
  max-width: 550px;
  min-height: 170px;
  gap: 20px;
  background-color: #bbb;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
`;

export const PromptText = styled.div`
  padding: 20px 40px;
  font-weight: 500;
  user-select: none;
  color: #151412;
  font-size: 18px;
  text-align: center;
  font-family: "QuickSand"
`;

export const RowDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  gap: 20px;
`;
