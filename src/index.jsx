import '@babel/polyfill';
import 'sanitize.css/sanitize.css';
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { App } from 'components/App';

const mountNode = document.getElementById('app');

const renderApp = (isHot = false) => {
  render(
    <App isHot={isHot} />,
    mountNode,
  );

  console.log(`${process.env.NAME} v${process.env.BUILD_VERSION} - ${process.env.NODE_ENV}`);
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('components/App', () => {
    unmountComponentAtNode(mountNode);
    renderApp();
  });
}

renderApp();
