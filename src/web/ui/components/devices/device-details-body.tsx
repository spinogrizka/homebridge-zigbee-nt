import React, { useState } from 'react';
import { Card, Heading, Pane, Paragraph, Tab, TabNavigation } from 'evergreen-ui';
import ReactJson from 'react-json-view';
import { DeviceStateManagement } from './device-state-management';
import { sizes } from '../constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CoordinatorModel, DeviceModel } from '../../../common/types';
import { CoordinatorInfo } from './coordinator-info';
import { DeviceInfo } from './device-info';

dayjs.extend(relativeTime);

const TABS = ['Info', 'Structure', 'State'];
const COORDINATOR_TABS = ['Info', 'Structure'];

interface Props {
  device: DeviceModel;
  refresh: () => void;
}

interface State {
  selectedTab: string;
  isLoadingState: boolean;
}

function isCoordinator(device: DeviceModel) {
  return device.type === 'Coordinator';
}

function renderStructure(device: DeviceModel) {
  return (
    <ReactJson src={device} onAdd={false} onDelete={false} onEdit={false} enableClipboard={false} />
  );
}

function renderCustomState(device: DeviceModel) {
  return <DeviceStateManagement device={device} />;
}

function renderSelectedTab(selectedTab: string, device: DeviceModel, props: Props) {
  let content = null;
  switch (selectedTab) {
    case 'Info':
      content = isCoordinator(device) ? (
        <CoordinatorInfo device={device as CoordinatorModel} />
      ) : (
        <DeviceInfo device={device} refresh={props.refresh} />
      );
      break;
    case 'Structure':
      content = renderStructure(device);
      break;
    case 'State':
      content = renderCustomState(device);
      break;
  }

  return (
    <Card
      backgroundColor="white"
      elevation={2}
      display="flex"
      flexDirection="column"
      padding={sizes.padding.small}
      height="100%"
    >
      {content}
    </Card>
  );
}

export function DeviceDetailsBody(props: Props) {
  const { device } = props;
  const [state, setState] = useState<State>({
    selectedTab: TABS[0],
    isLoadingState: false,
  });
  return (
    <Pane height="100%">
      <Pane padding={sizes.padding.large} borderBottom="muted" height={`${sizes.header.medium}px`}>
        <Heading size={600}>
          {device.manufacturerName} {device.modelID}
        </Heading>
        <Paragraph size={400} color="muted">
          Type: {device.type}
        </Paragraph>
      </Pane>
      <Pane
        display="flex"
        padding={sizes.padding.large}
        flexDirection="column"
        height={`calc(100% - ${sizes.header.medium}px)`}
      >
        <TabNavigation marginBottom={sizes.margin.medium}>
          {(isCoordinator(device) ? COORDINATOR_TABS : TABS).map(tab => (
            <Tab
              key={tab}
              isSelected={state.selectedTab === tab}
              onSelect={() => setState({ ...state, selectedTab: tab })}
            >
              {tab}
            </Tab>
          ))}
        </TabNavigation>
        {renderSelectedTab(state.selectedTab, device, props)}
      </Pane>
    </Pane>
  );
}
