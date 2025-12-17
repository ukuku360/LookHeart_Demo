import { useState } from 'react';
import { mockData } from '../data/mockData';

/**
 * Simulates Bluetooth device connection with state machine
 * States: 'disconnected' | 'connecting' | 'connected'
 */
export function useBluetoothSimulation() {
  const [status, setStatus] = useState('disconnected');
  const [data, setData] = useState(mockData.realtime.disconnected);

  /**
   * Initiate connection (simulate 2-second connection time)
   */
  const connect = () => {
    if (status === 'disconnected') {
      setStatus('connecting');

      // Simulate connection delay
      setTimeout(() => {
        setStatus('connected');
        setData(mockData.realtime.connected);
      }, 2000);
    }
  };

  /**
   * Disconnect device immediately
   */
  const disconnect = () => {
    setStatus('disconnected');
    setData(mockData.realtime.disconnected);
  };

  return {
    status, // 'disconnected' | 'connecting' | 'connected'
    data, // Current real-time metrics
    connect,
    disconnect,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isDisconnected: status === 'disconnected',
  };
}

export default useBluetoothSimulation;
