import React from 'react';
import ReactDOM from 'react-dom';

import MyComponent from './MyComponent'

describe('<MyComponent /> rendering', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<MyComponent />, div);
  });
});
