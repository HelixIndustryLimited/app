import {useState} from 'react';
import {Pane} from './pane';
import styled from 'styled-components';
import {
  ControlRow,
  Label,
  Detail,
  Grid,
  MenuCell,
  Row,
  IconContainer,
  SpanOverflowCell,
} from './grid';
import {AccentSlider} from '../inputs/accent-slider';
import {useDispatch} from 'react-redux';
import {useAppSelector} from 'src/store/hooks';
import {
  getShowDesignTab,
  getDisableFastRemap,
  toggleCreatorMode,
  toggleFastRemap,
  getThemeMode,
  toggleThemeMode,
  getThemeName,
  updateThemeName,
  getRenderMode,
  updateRenderMode,
} from 'src/store/settingsSlice';
import {AccentSelect} from '../inputs/accent-select';
import {THEMES} from 'src/utils/themes';
import {MenuContainer} from './configure-panes/custom/menu-generator';
import {MenuTooltip} from '../inputs/tooltip';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faToolbox, faKeyboard, faStethoscope, faBrush, faGear} from '@fortawesome/free-solid-svg-icons';
import {getSelectedConnectedDevice} from 'src/store/devicesSlice';
import {ErrorMessage} from '../styled';
import {webGLIsAvailable} from 'src/utils/test-webgl';
import {useLocation} from 'wouter';
import Dock from '../dock/dock';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 12px;
`;

const DiagnosticContainer = styled(Container)`
  margin-top: 20px;
  padding-top: 20px;
`;

const DockContainer = styled.div`
  position: fixed;
  top: 54px;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 0;
  margin-top: -230px;
`;

const SettingsErrorMessage = styled(ErrorMessage)`
  margin: 0;
  font-style: italic;
`;

export const Settings = () => {
  const dispatch = useDispatch();
  const showDesignTab = useAppSelector(getShowDesignTab);
  const disableFastRemap = useAppSelector(getDisableFastRemap);
  const themeMode = useAppSelector(getThemeMode);
  const themeName = useAppSelector(getThemeName);
  const renderMode = useAppSelector(getRenderMode);
  const selectedDevice = useAppSelector(getSelectedConnectedDevice);
  const [, setLocation] = useLocation();

  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const themeSelectOptions = Object.keys(THEMES).map((k) => ({
    label: k.replaceAll('_', ' '),
    value: k,
  }));
  const themeDefaultValue = themeSelectOptions.find(
    (opt) => opt.value === themeName,
  );

  const renderModeOptions = webGLIsAvailable
    ? [
        {
          label: '2D',
          value: '2D',
        },
        {
          label: '3D',
          value: '3D',
        },
      ]
    : [{label: '2D', value: '2D'}];
  const renderModeDefaultValue = renderModeOptions.find(
    (opt) => opt.value === renderMode,
  );
  
  const dockItems = [
    { 
      icon: <FontAwesomeIcon icon={faKeyboard} size="lg" />, 
      label: 'Configure', 
      onClick: () => setLocation('/') 
    },
    { 
      icon: <FontAwesomeIcon icon={faStethoscope} size="lg" />, 
      label: 'Key Tester', 
      onClick: () => setLocation('/test') 
    },
    { 
      icon: <FontAwesomeIcon icon={faBrush} size="lg" />, 
      label: 'Design', 
      onClick: () => setLocation('/design') 
    },
    { 
      icon: <FontAwesomeIcon icon={faGear} size="lg" />, 
      label: 'Settings', 
      onClick: () => setLocation('/settings') 
    },
  ];
  
  return (
    <>
      <Pane style={{paddingTop: '54px', boxSizing: 'border-box'}}>
        <Grid style={{overflow: 'hidden'}}>
        <MenuCell style={{pointerEvents: 'all', borderTop: 'none'}}>
          {/* <MenuContainer>
            <Row $selected={true}>
              <IconContainer>
                <FontAwesomeIcon icon={faToolbox} />
                <MenuTooltip>General</MenuTooltip>
              </IconContainer>
            </Row>
          </MenuContainer> */}
        </MenuCell>
        <SpanOverflowCell style={{flex: 1, borderWidth: 0}}>
          <Container>
            <ControlRow>
              {/* <Label>Show Design tab</Label>
              <Detail>
                <AccentSlider
                  onChange={() => dispatch(toggleCreatorMode())}
                  isChecked={showDesignTab}
                />
              </Detail> */}
            </ControlRow>
            <ControlRow>
              <Label className="light-label">Fast Key Mapping</Label>
              <Detail>
                <AccentSlider
                  onChange={() => dispatch(toggleFastRemap())}
                  isChecked={!disableFastRemap}
                />
              </Detail>
            </ControlRow>
            {/* <ControlRow>
              <Label>Keycap Theme</Label>
              <Detail>
                <AccentSelect
                  defaultValue={themeDefaultValue}
                  options={themeSelectOptions}
                  onChange={(option: any) => {
                    option && dispatch(updateThemeName(option.value));
                  }}
                />
              </Detail>
            </ControlRow> */}
            {/* <ControlRow>
              <Label>Render Mode</Label>
              <Detail>
                <AccentSelect
                  defaultValue={renderModeDefaultValue}
                  options={renderModeOptions}
                  onChange={(option: any) => {
                    option && dispatch(updateRenderMode(option.value));
                  }}
                />
              </Detail>
            </ControlRow> */}
            <ControlRow>
              <Label className="light-label">Show Diagnostic Information</Label>

              <Detail>
                {selectedDevice ? (
                  <AccentSlider
                    onChange={() => setShowDiagnostics(!showDiagnostics)}
                    isChecked={showDiagnostics}
                  />
                ) : (
                  <SettingsErrorMessage>
                    Requires connected device
                  </SettingsErrorMessage>
                )}
              </Detail>
            </ControlRow>
          </Container>
          {showDiagnostics && selectedDevice ? (
            <DiagnosticContainer>
              <ControlRow>
                <Label className="light-label">VIA Firmware Protocol</Label>
                <Detail>{selectedDevice.protocol}</Detail>
              </ControlRow>
            </DiagnosticContainer>
          ) : null}
        </SpanOverflowCell>
      </Grid>
    </Pane>
    <DockContainer>
      <Dock 
        items={dockItems}
          panelHeight={40}
          baseItemSize={40}
          magnification={45}
          distance={90}
      />
    </DockContainer>
  </>
  );
};
