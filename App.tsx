import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './src/pages/Home';
import Inventory from './src/pages/Inventory';
import POS from './src/pages/POS';
import Customers from './src/pages/Customers';
import Reports from './src/pages/Reports';
import Settings from './src/pages/Settings';
import NotFound from './src/pages/NotFound';
import Layout from './src/components/Layout';
import { PharmacyProvider } from './src/context/PharmacyContext';

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <PharmacyProvider>
        <Router basename="/pharmacy-management">
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
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
      </PharmacyProvider>
    </Theme>
  );
}

export default App;