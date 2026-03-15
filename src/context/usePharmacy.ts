import { useContext } from 'react';
import { PharmacyContext } from './PharmacyContext';

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
