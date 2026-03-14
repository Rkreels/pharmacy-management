import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './src/pages/Home';
import Inventory from './src/pages/Inventory';
import POS from './src/pages/POS';
import NotFound from './src/pages/NotFound';
import Layout from './src/components/Layout';

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <Router basename="/pharmacy-management">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pos" element={<POS />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </Router>
    </Theme>
  );
}

export default App;