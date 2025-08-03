import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Droplets, Thermometer, Footprints } from 'lucide-react-native';
import HealthChart from '../components/HealthChart';
import { getVitalsByPeriod, getChartData, VitalData } from '../data/mockVitals';

type TimePeriod = 'day' | 'week' | 'month';

export default function VitalDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const metric = params.metric as string;
  
  // Parse data and convert timestamp strings back to Date objects with error handling
  let data: VitalData[] = [];
  try {
    const rawData = JSON.parse(params.data as string);
    data = rawData.map((vital: any) => ({
      ...vital,
      timestamp: new Date(vital.timestamp)
    }));
  } catch (error) {
    console.error('Error parsing vital data:', error);
    // Fallback to empty data if parsing fails
    data = [];
  }
  
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day');

  const getMetricInfo = () => {
    switch (metric) {
      case 'heartRate':
        return {
          title: 'Heart Rate',
          icon: <Heart size={24} color="#ff4757" />,
          unit: 'bpm',
          color: '#ff4757',
        };
      case 'spO2':
        return {
          title: 'SpO₂',
          icon: <Droplets size={24} color="#04A7F5" />,
          unit: '%',
          color: '#04A7F5',
        };
      case 'temperature':
        return {
          title: 'Temperature',
          icon: <Thermometer size={24} color="#ffa502" />,
          unit: '°C',
          color: '#ffa502',
        };
      case 'steps':
        return {
          title: 'Steps',
          icon: <Footprints size={24} color="#2ed573" />,
          unit: '',
          color: '#2ed573',
        };
      default:
        return {
          title: 'Unknown',
          icon: null,
          unit: '',
          color: '#666',
        };
    }
  };

  const metricInfo = getMetricInfo();
  const filteredData = getVitalsByPeriod(data, selectedPeriod);
  const chartData = getChartData(filteredData, metric as keyof Omit<VitalData, 'timestamp'>);

  const PeriodButton = ({ period, label }: { period: TimePeriod; label: string }) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === period && styles.periodButtonActive
      ]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text style={[
        styles.periodButtonText,
        selectedPeriod === period && styles.periodButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.metricHeader}>
            {metricInfo.icon}
            <Text style={styles.metricTitle}>{metricInfo.title}</Text>
          </View>
        </View>
      </View>

      <View style={styles.periodSelector}>
        <PeriodButton period="day" label="Day" />
        <PeriodButton period="week" label="Week" />
        <PeriodButton period="month" label="Month" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <HealthChart
          data={chartData}
          title={`${metricInfo.title} - ${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}`}
          unit={metricInfo.unit}
          color={metricInfo.color}
          period={selectedPeriod}
        />
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#04A7F5',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
}); 