import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleDown, faPlus} from '@fortawesome/free-solid-svg-icons';
import {HID} from '../../../shims/node-hid';
import type {VIADefinitionV2, VIADefinitionV3} from '@the-via/reader';
import type {ConnectedDevice} from '../../../types/types';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {
  getDefinitions,
  getSelectedDefinition,
} from 'src/store/definitionsSlice';
import {
  getConnectedDevices,
  getSelectedDevicePath,
} from 'src/store/devicesSlice';
import {selectConnectedDeviceByPath} from 'src/store/devicesThunks';
import {isElectron} from 'src/utils/running-context';

const Container = styled.div`
  position: absolute;
  right: 15px;
  top: 0px;
  font-size: 16px;
  pointer-events: none;
  font-weight: 600;
  font-family: "QuickSand";
`;

const KeyboardTitle = styled.label`
  pointer-events: all;
  display: inline-block;
  background: var(--color_accent);
  border-radius: 6px;
  font-size: 16px;
  text-transform: uppercase;
  color: #151412;
  letter-spacing: 1px;
  padding: 1px 15px;
  margin-right: 0px;
  border: solid 1px var(--bg_control);
  cursor: pointer;
  transition: transform 0.2s ease-in;
  .inner-content {
    display: inline-block;
    transition: transform 0.2s ease-in;
  }
  &:hover {
    transform: scale(1.05);
    .inner-content {
      transform: scale(0.9523);
    }
  }
`;
const KeyboardList = styled.ul<{$show: boolean}>`
  padding: 0;
  border: 1px solid var(--bg_control);
  width: 160px;
  border-radius: 6px;
  background-color: var(--bg_menu);
  margin: 0;
  margin-top: 5px;
  right: 0px;
  position: absolute;
  pointer-events: ${(props) => (props.$show ? 'all' : 'none')};
  transition: all 0.2s ease-out;
  z-index: 11;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  overflow: hidden;
  transform: ${(props) => (props.$show ? 0 : `translateY(-5px)`)};
`;
const KeyboardButton = styled.button<{$selected?: boolean}>`
  display: block;
  text-align: center;
  outline: none;
  font-variant-numeric: tabular-nums;
  font-family: "QuickSand";
  font-size: 14px;
  font-weight:600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  border: none;
  background: ${(props) =>
    props.$selected ? 'var(--bg_icon-highlighted)' : 'transparent'};
  color: ${(props) =>
    props.$selected
      ? '#555'
      : 'var(--color_label-highlighted)'};
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  text-transform: uppercase;
  padding: 5px 10px;
  &:hover {
    border: none;
    background: ${(props) =>
      props.$selected ? 'var(--bg_icon-highlighted)' : 'var(--bg_control)'};
    color: ${(props) =>
      props.$selected
        ? 'var(--color_control-highlighted)'
        : 'var(--color_label-highlighted)'};
  }
`;

const ClickCover = styled.div`
  position: fixed;
  z-index: 10;
  pointer-events: all;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.4;
  background: rgba(0, 0, 0, 0.75);
`;

type ConnectedKeyboardDefinition = [string, VIADefinitionV2 | VIADefinitionV3];

const KeyboardSelectors: React.FC<{
  show: boolean;
  keyboards: ConnectedKeyboardDefinition[];
  selectedPath: string;
  onClickOut: () => void;
  selectKeyboard: (kb: string) => void;
}> = (props) => {
  const requestAndChangeDevice = async () => {
    const device = await HID.requestDevice();
    if (device) {
      props.selectKeyboard((device as any).__path);
    }
  };
  return (
    <>
      {props.show && <ClickCover onClick={props.onClickOut} />}
      <KeyboardList $show={props.show}>
        {props.keyboards.map(([path, keyboard]) => {
          return (
            <KeyboardButton
              $selected={path === props.selectedPath}
              key={path}
              onClick={() => props.selectKeyboard(path as string)}
            >
              {keyboard.name}
            </KeyboardButton>
          );
        })}
        {!isElectron && (
          <KeyboardButton onClick={requestAndChangeDevice}>
            Authorize New
            <FontAwesomeIcon icon={faPlus} style={{marginLeft: '10px'}} />
          </KeyboardButton>
        )}
      </KeyboardList>
    </>
  );
};

export const Badge = () => {
  const dispatch = useAppDispatch();
  const definitions = useAppSelector(getDefinitions);
  const selectedDefinition = useAppSelector(getSelectedDefinition);
  const connectedDevices = useAppSelector(getConnectedDevices);
  const selectedPath = useAppSelector(getSelectedDevicePath);
  const [showList, setShowList] = useState(false);

  const connectedKeyboardDefinitions: ConnectedKeyboardDefinition[] = useMemo(
    () =>
      Object.entries(connectedDevices)
        .map<ConnectedKeyboardDefinition>(([path, device]) => [
          path,
          definitions[(device as ConnectedDevice).vendorProductId] &&
            definitions[(device as ConnectedDevice).vendorProductId][
              (device as ConnectedDevice).requiredDefinitionVersion
            ],
        ])
        .filter((i) => i[1]),
    [connectedDevices, definitions],
  );

  if (!selectedDefinition || !selectedPath) {
    return null;
  }

  return (
    <>
      <Container>
        <KeyboardTitle onClick={() => setShowList(!showList)}>
          <span className="inner-content">
            {selectedDefinition.name}
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{
                transform: showList ? 'rotate(180deg)' : '',
                transition: 'transform 0.2s ease-out',
                marginLeft: '5px',
              }}
            />
          </span>
        </KeyboardTitle>
        <KeyboardSelectors
          show={showList}
          selectedPath={selectedPath}
          keyboards={connectedKeyboardDefinitions}
          onClickOut={() => setShowList(false)}
          selectKeyboard={(path) => {
            dispatch(selectConnectedDeviceByPath(path));
            setShowList(false);
          }}
        />
      </Container>
    </>
  );
};
