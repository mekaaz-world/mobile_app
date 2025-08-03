import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft, Heart } from 'lucide-react-native';

interface VitalDetailScreenProps {
  metric: string;
  onBack: () => void;
}

export default function VitalDetailScreen({ metric, onBack }: VitalDetailScreenProps) {
  const [timeframe, setTimeframe] = useState<'hour' | 'day' | 'week'>('day');
  const [currentValue] = useState(72);

  const TimeframeButton = ({ label, value }: { label: string; value: 'hour' | 'day' | 'week' }) => (
    <TouchableOpacity
      style={[styles.timeframeButton, timeframe === value && styles.activeTimeframeButton]}
      onPress={() => setTimeframe(value)}
    >
      <Text style={[styles.timeframeText, timeframe === value && styles.activeTimeframeText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Heart size={24} color="#ff4757" />
          <Text style={styles.title}>Heart Rate</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.currentValue}>
          <Text style={styles.valueText}>{currentValue}</Text>
          <Text style={styles.unitText}>bpm</Text>
          <Text style={styles.statusText}>Normal Range</Text>
        </View>

        <View style={styles.timeframeContainer}>
          <TimeframeButton label="Hour" value="hour" />
          <TimeframeButton label="Day" value="day" />
          <TimeframeButton label="Week" value="week" />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartPlaceholder}>
            📈 Chart would display {timeframe} view here
          </Text>
        </View>

        <TouchableOpacity style={styles.viewAllButton} onPress={onBack}>
          <Text style={styles.viewAllText}>View All Metrics</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  currentValue: {
    alignItems: 'center',
    marginBottom: 32,
  },
  valueText: {
    fontSize: 64,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  unitText: {
    fontSize: 18,
    color: '#666',
    marginTop: -8,
  },
  statusText: {
    fontSize: 14,
    color: '#2ed573',
    marginTop: 8,
    fontWeight: '500',
  },
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTimeframeButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeframeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTimeframeText: {
    color: '#04A7F5',
  },
  chartContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  chartPlaceholder: {
    fontSize: 16,
    color: '#666',
  },
  viewAllButton: {
    backgroundColor: '#04A7F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});