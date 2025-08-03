import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Bluetooth, Check } from 'lucide-react-native';

interface Device {
  id: string;
  name: string;
  signal: number;
}

export default function DevicePairing() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(true);
  const [pairing, setPairing] = useState<string | null>(null);

  useEffect(() => {
    // Simulate BLE scanning
    const timer = setTimeout(() => {
      setDevices([
        { id: '1', name: 'Mekaaz-1001', signal: 85 },
        { id: '2', name: 'Mekaaz-1002', signal: 72 },
        { id: '3', name: 'Mekaaz-1003', signal: 90 },
      ]);
      setScanning(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handlePairDevice = (device: Device) => {
    Alert.alert(
      'Pair Device',
      `Pair with ${device.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setPairing(device.id);
            setTimeout(() => {
              Alert.alert('Success', 'Device paired successfully!', [
                { text: 'OK', onPress: () => router.push('/(tabs)') }
              ]);
            }, 2000);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Bluetooth size={48} color="#04A7F5" />
          </View>
          <Text style={styles.title}>Device Pairing</Text>
          <Text style={styles.subtitle}>
            {scanning ? 'Searching for bracelet...' : 'Select your device'}
          </Text>
        </View>

        {scanning ? (
          <View style={styles.scanningContainer}>
            <ActivityIndicator size="large" color="#04A7F5" />
            <Text style={styles.scanningText}>Scanning for devices...</Text>
          </View>
        ) : (
          <View style={styles.deviceList}>
            {devices.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={[
                  styles.deviceCard,
                  pairing === device.id && styles.pairingCard
                ]}
                onPress={() => handlePairDevice(device)}
                disabled={pairing !== null}
              >
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceSignal}>Signal: {device.signal}%</Text>
                </View>
                {pairing === device.id ? (
                  <ActivityIndicator size="small" color="#04A7F5" />
                ) : (
                  <View style={styles.signalBars}>
                    {[...Array(4)].map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.signalBar,
                          i < Math.floor(device.signal / 25) && styles.signalBarActive
                        ]}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 60,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  scanningText: {
    fontSize: 16,
    color: '#666',
  },
  deviceList: {
    gap: 12,
  },
  deviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  pairingCard: {
    borderColor: '#04A7F5',
    backgroundColor: '#f8fcff',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  deviceSignal: {
    fontSize: 14,
    color: '#666',
  },
  signalBars: {
    flexDirection: 'row',
    gap: 2,
  },
  signalBar: {
    width: 4,
    height: 16,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
  },
  signalBarActive: {
    backgroundColor: '#04A7F5',
  },
});