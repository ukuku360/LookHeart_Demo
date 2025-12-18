import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockData } from '../data/mockData';

const BluetoothContext = createContext(null);

export function BluetoothProvider({ children }) {
  const [status, setStatus] = useState('disconnected');
  const [data, setData] = useState(mockData.realtime.disconnected);

  const connect = useCallback(() => {
    if (status === 'disconnected') {
      setStatus('connecting');
      // Simulate connection delay
      setTimeout(() => {
        setStatus('connected');
        setData(mockData.realtime.connected);
      }, 2000);
    }
  }, [status]);

  const disconnect = useCallback(() => {
    setStatus('disconnected');
    setData(mockData.realtime.disconnected);
  }, []);

  const value = {
    status,
    data,
    connect,
    disconnect,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isDisconnected: status === 'disconnected',
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
}

export function useBluetooth() {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
}
