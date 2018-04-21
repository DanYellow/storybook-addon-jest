/* eslint-disable react/no-danger */
import React from 'react';
import addons from '@storybook/addons';

import TestPanelTitle from './components/tests/PanelTitle';
import TestsPanel from './components/tests/Panel';

import CoveragePanelTitle from './components/coverage/PanelTitle';
import CoveragePanel from './components/coverage/Panel';

// Register the addon with a unique name.
addons.register('storybook/tests', api => {
  // Also need to set a unique name to the panel.
  addons.addPanel('storybook/tests/panel', {
    title: <TestPanelTitle channel={addons.getChannel()} api={api} />,
    render: () => <TestsPanel channel={addons.getChannel()} api={api} />,
  });
  addons.addPanel('storybook/coverage/panel', {
    title: <CoveragePanelTitle channel={addons.getChannel()} api={api} />,
    render: () => <CoveragePanel channel={addons.getChannel()} api={api} />,
  })
});
