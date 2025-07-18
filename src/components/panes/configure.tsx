import React, {useState, useEffect} from 'react';
import {faPlus, faKeyboard, faStethoscope, faBrush, faGear, faStar, faBagShopping, faSignature, faPlug} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import DotGrid from '../DotGrid/DotGrid';
import {CenterPane, ConfigureBasePane} from './pane';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useLocation} from 'wouter';
import Dock from '../dock/dock';
import {
  CustomFeaturesV2,
  getLightingDefinition,
  isVIADefinitionV2,
  isVIADefinitionV3,
  VIADefinitionV2,
  VIADefinitionV3,
} from '@the-via/reader';
import {Grid, Row, IconContainer, MenuCell, ConfigureFlexCell} from './grid';
import * as Keycode from './configure-panes/keycode';
import * as Lighting from './configure-panes/lighting';
import * as Macros from './configure-panes/macros';
import * as SaveLoad from './configure-panes/save-load';
import * as Layouts from './configure-panes/layouts';
import * as RotaryEncoder from './configure-panes/custom/satisfaction75';
import {makeCustomMenus} from './configure-panes/custom/menu-generator';
import {LayerControl} from './configure-panes/layer-control';
import {Badge} from './configure-panes/badge';
import {useAppSelector, useAppDispatch} from 'src/store/hooks';
import {getSelectedDefinition} from 'src/store/definitionsSlice';
import {
  clearSelectedKey,
  getLoadProgress,
  getNumberOfLayers,
  setConfigureKeyboardIsSelectable,
} from 'src/store/keymapSlice';
import {useDispatch} from 'react-redux';
import {reloadConnectedDevices} from 'src/store/devicesThunks';
import {getV3MenuComponents} from 'src/store/menusSlice';
import {getIsMacroFeatureSupported} from 'src/store/macrosSlice';
import {getConnectedDevices, getSupportedIds} from 'src/store/devicesSlice';
import {isElectron} from 'src/utils/running-context';
import {MenuTooltip} from '../inputs/tooltip';
import {getRenderMode} from 'src/store/settingsSlice';

const MenuContainer = styled.div`
  padding: 15px 10px 20px 10px;
`;

const Rows = [
  Keycode,
  Macros,
  Layouts,
  Lighting,
  SaveLoad,
  RotaryEncoder,
  ...makeCustomMenus([]),
];
function getCustomPanes(customFeatures: CustomFeaturesV2[]) {
  if (
    customFeatures.find((feature) => feature === CustomFeaturesV2.RotaryEncoder)
  ) {
    return [RotaryEncoder];
  }
  return [];
}

const getRowsForKeyboard = (): typeof Rows => {
  const showMacros = useAppSelector(getIsMacroFeatureSupported);
  const v3Menus = useAppSelector(getV3MenuComponents);
  const selectedDefinition = useAppSelector(getSelectedDefinition);
  const numberOfLayers = useAppSelector(getNumberOfLayers);

  if (!selectedDefinition) {
    return [];
  } else if (isVIADefinitionV2(selectedDefinition)) {
    return getRowsForKeyboardV2(selectedDefinition, showMacros, numberOfLayers);
  } else if (isVIADefinitionV3(selectedDefinition)) {
    return [
      ...filterInferredRows(selectedDefinition, showMacros, numberOfLayers, [
        Keycode,
        Layouts,
        Macros,
        SaveLoad,
      ]),
      ...v3Menus,
    ];
  } else {
    return [];
  }
};

const filterInferredRows = (
  selectedDefinition: VIADefinitionV3 | VIADefinitionV2,
  showMacros: boolean,
  numberOfLayers: number,
  rows: typeof Rows,
): typeof Rows => {
  const {layouts} = selectedDefinition;
  let removeList: typeof Rows = [];
  // LAYOUTS IS INFERRED, filter out if doesn't exist
  if (
    !(layouts.optionKeys && Object.entries(layouts.optionKeys).length !== 0)
  ) {
    removeList = [...removeList, Layouts];
  }

  if (numberOfLayers === 0) {
    removeList = [...removeList, Keycode, SaveLoad];
  }

  if (!showMacros) {
    removeList = [...removeList, Macros];
  }
  let filteredRows = rows.filter(
    (row) => !removeList.includes(row),
  ) as typeof Rows;
  return filteredRows;
};

const getRowsForKeyboardV2 = (
  selectedDefinition: VIADefinitionV2,
  showMacros: boolean,
  numberOfLayers: number,
): typeof Rows => {
  let rows: typeof Rows = [Keycode, Layouts, Macros, SaveLoad];
  if (isVIADefinitionV2(selectedDefinition)) {
    const {lighting, customFeatures} = selectedDefinition;
    const {supportedLightingValues} = getLightingDefinition(lighting);
    if (supportedLightingValues.length !== 0) {
      rows = [...rows, Lighting];
    }
    if (customFeatures) {
      rows = [...rows, ...getCustomPanes(customFeatures)];
    }
  }
  return filterInferredRows(
    selectedDefinition,
    showMacros,
    numberOfLayers,
    rows,
  );
};

const Loader: React.FC<{
  loadProgress: number;
  selectedDefinition: VIADefinitionV2 | VIADefinitionV3 | null;
}> = (props) => {
  const {loadProgress, selectedDefinition} = props;
  const dispatch = useAppDispatch();

  const connectedDevices = useAppSelector(getConnectedDevices);
  const supportedIds = useAppSelector(getSupportedIds);
  const noSupportedIds = !Object.values(supportedIds).length;
  const noConnectedDevices = !Object.values(connectedDevices).length;
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    // TODO: Remove the timeout because it is funky
    const timeout = setTimeout(() => {
      if (!selectedDefinition) {
        setShowButton(true);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [selectedDefinition]);
  return (
    <LoaderPane>
      <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0}}>
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor="#29282c"
          activeColor="#5e35c6"
          proximity={120}
          shockRadius={150}
          shockStrength={5}
          resistance={750}
          returnDuration={2}
        />
      </div>
      {(showButton || noConnectedDevices) && !noSupportedIds && !isElectron ? (
        <button
          onClick={() => dispatch(reloadConnectedDevices())}
          style={{
            border: '1px solid #222',
            outline: 'none',
            background: '#000',
            color: 'white',
            fontSize: '16px',
            textAlign: 'center',
            padding: '16px 24px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'padding 0.3s ease',
            fontFamily: 'Lexend',
            zIndex: 1,
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.padding = '18px 28px';
            const icon = (e.target as HTMLButtonElement).querySelector('svg');
            if (icon) icon.style.color = '#545454ff';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.padding = '16px 24px';
            (e.target as HTMLButtonElement).style.backgroundColor = '#000';
            const icon = (e.target as HTMLButtonElement).querySelector('svg');
            if (icon) icon.style.color = 'white';
          }}
        >
          Authorize device
          <FontAwesomeIcon style={{marginLeft: '10px', transition: 'color 0.3s ease'}} icon={faPlug} />
        </button>
      ) : null}
    </LoaderPane>
  );
};

const LoaderPane = styled(CenterPane)`
  display: flex;
  align-items: center;
  justify-content: center;
  row-gap: 50px;
  position: absolute;
  bottom: 50px;
  top: 50px;
  left: 0;
  right: 0;
  z-index: 4;
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

export const ConfigurePane = () => {
  const selectedDefinition = useAppSelector(getSelectedDefinition);
  const loadProgress = useAppSelector(getLoadProgress);
  const renderMode = useAppSelector(getRenderMode);
  const [, setLocation] = useLocation();

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

  const showLoader = !selectedDefinition || loadProgress !== 1;
  return (
    <>
      {showLoader ? (
        renderMode === '2D' ? (
          <Loader
            selectedDefinition={selectedDefinition || null}
            loadProgress={loadProgress}
          />
        ) : null
      ) : (
        <ConfigureBasePane>
          <ConfigureGrid />
        </ConfigureBasePane>
      )}
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

const ConfigureGrid = () => {
  const dispatch = useDispatch();

  const [selectedRow, setRow] = useState(0);
  const KeyboardRows = getRowsForKeyboard();
  const SelectedPane = KeyboardRows[selectedRow]?.Pane;
  const selectedTitle = KeyboardRows[selectedRow]?.Title;

  useEffect(() => {
    if (selectedTitle !== 'Keymap') {
      dispatch(setConfigureKeyboardIsSelectable(false));
    } else {
      dispatch(setConfigureKeyboardIsSelectable(true));
    }
  }, [selectedTitle]);

  return (
    <>
      <ConfigureFlexCell
        onClick={(evt) => {
          if ((evt.target as any).nodeName !== 'CANVAS')
            dispatch(clearSelectedKey());
        }}
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
        }}
      >
        <div style={{pointerEvents: 'all'}}>
          <LayerControl />
          <Badge />
        </div>
      </ConfigureFlexCell>
      <Grid style={{pointerEvents: 'none'}}>
        <MenuCell style={{pointerEvents: 'all'}}>
          <MenuContainer>
            {(KeyboardRows || []).map(
              ({Icon, Title}: {Icon: any; Title: string}, idx: number) => (
                <Row
                  key={idx}
                  onClick={(_) => setRow(idx)}
                  $selected={selectedRow === idx}
                >
                  <IconContainer>
                    <Icon />
                    <MenuTooltip>{Title}</MenuTooltip>
                  </IconContainer>
                </Row>
              ),
            )}
          </MenuContainer>
        </MenuCell>

        {SelectedPane && <SelectedPane />}
      </Grid>
    </>
  );
};
