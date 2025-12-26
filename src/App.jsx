import React from 'react';
import { ConfigProvider } from 'antd';
import Layout from './components/Layout';

const App = () => {
  return (
    <ConfigProvider>
      <Layout />
    </ConfigProvider>
  );
};

export default App;