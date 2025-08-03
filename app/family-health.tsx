import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Droplets, Thermometer, Footprints } from 'lucide-react-native';
import HealthChart from '../components/HealthChart';
import { getVitalsByPeriod, getChartData, VitalData } from '../data/mockVitals';

type TimePeriod = 'day' | 'week' | 'month';

export default function FamilyHealth() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const memberId = params.memberId as string;
  const memberName = params.memberName as string;
  const memberRole = params.memberRole as string;
  
  // Parse data and convert timestamp strings back to Date objects with error handling
  let data: VitalData[] = [];
  try {
    const rawData = JSON.parse(params.data as string);
    data = rawData.map((vital: any) => ({
      ...vital,
      timestamp: new Date(vital.timestamp)
    }));
  } catch (error) {
    console.error('Error parsing family health data:', error);
    // Fallback to empty data if parsing fails
    data = [];
  }
  
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day');

  const metrics = [
    {
      id: 'heartRate',
      title: 'Heart Rate',
      icon: <Heart size={24} color="#ff4757" />,
      unit: 'bpm',
      color: '#ff4757',
    },
    {
      id: 'spO2',
      title: 'SpO₂',
      icon: <Droplets size={24} color="#04A7F5" />,
      unit: '%',
      color: '#04A7F5',
    },
    {
      id: 'temperature',
      title: 'Temperature',
      icon: <Thermometer size={24} color="#ffa502" />,
      unit: '°C',
      color: '#ffa502',
    },
    {
      id: 'steps',
      title: 'Steps',
      icon: <Footprints size={24} color="#2ed573" />,
      unit: '',
      color: '#2ed573',
    },
  ];

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
          <Text style={styles.memberName}>{memberName}</Text>
          <Text style={styles.memberRole}>{memberRole}</Text>
        </View>
      </View>

      <View style={styles.periodSelector}>
        <PeriodButton period="day" label="Day" />
        <PeriodButton period="week" label="Week" />
        <PeriodButton period="month" label="Month" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {metrics.map((metric) => {
          const filteredData = getVitalsByPeriod(data, selectedPeriod);
          const chartData = getChartData(filteredData, metric.id as keyof Omit<VitalData, 'timestamp'>);
          
          return (
            <View key={metric.id} style={styles.chartContainer}>
              <HealthChart
                data={chartData}
                title={`${memberName}'s ${metric.title} - ${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}`}
                unit={metric.unit}
                color={metric.color}
                period={selectedPeriod}
              />
            </View>
          );
        })}
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
  memberName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 16,
    color: '#666',
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
  chartContainer: {
    marginBottom: 16,
  },
}); 