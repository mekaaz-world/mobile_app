import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Droplets, Thermometer, Footprints, ChevronRight, TrendingUp } from 'lucide-react-native';
import { generateMockVitals, getAverageVitals, getVitalsByPeriod, VitalData } from '../../data/mockVitals';
import HealthChart from '../../components/HealthChart';

type TimePeriod = 'average' | 'day' | 'week' | 'month';

const mockData = generateMockVitals(30); // 30 days of comprehensive data

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

export default function History() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('average');

  const getDataForPeriod = (metricId: string, period: TimePeriod) => {
    if (period === 'average') {
      const avgData = getAverageVitals(mockData);
      return {
        labels: ['Average'],
        datasets: [{ data: [avgData[metricId as keyof VitalData] as number] }]
      };
    }
    
    const periodData = getVitalsByPeriod(mockData, period as 'day' | 'week' | 'month');
    const chartData = periodData.map(vital => ({
      value: vital[metricId as keyof VitalData] as number,
      timestamp: vital.timestamp,
    }));
    
    return chartData;
  };

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

  const Sparkline = ({ data }: { data: number[] }) => (
    <View style={styles.sparklineContainer}>
      {data.map((value, index) => {
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const normalizedHeight = ((value - minValue) / (maxValue - minValue)) * 30 + 5;
        
        return (
          <View
            key={index}
            style={[
              styles.sparklineBar,
              { height: normalizedHeight }
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Trends</Text>
        <Text style={styles.subtitle}>Track your progress over time</Text>
      </View>

      <View style={styles.periodSelector}>
        <PeriodButton period="average" label="Average" />
        <PeriodButton period="day" label="Day" />
        <PeriodButton period="week" label="Week" />
        <PeriodButton period="month" label="Month" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedPeriod === 'average' ? (
          // Show summary cards for average view
          metrics.map((metric) => {
            const avgData = getAverageVitals(mockData);
            const avgValue = avgData[metric.id as keyof VitalData] as number;
            
            return (
              <TouchableOpacity
                key={metric.id}
                style={styles.metricCard}
                onPress={() => {
                  router.push({
                    pathname: '/vital-detail',
                    params: { 
                      metric: metric.id, 
                      data: JSON.stringify(mockData) 
                    }
                  });
                }}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconContainer}>
                    {metric.icon}
                  </View>
                  <View style={styles.metricInfo}>
                    <Text style={styles.metricTitle}>{metric.title}</Text>
                    <Text style={styles.metricAvg}>Avg: {avgValue} {metric.unit}</Text>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <Sparkline data={[avgValue, avgValue + 2, avgValue - 1, avgValue + 1, avgValue]} />
                  <View style={styles.trendContainer}>
                    <TrendingUp size={16} color="#2ed573" />
                    <ChevronRight size={20} color="#ccc" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          // Show detailed charts for other periods
          metrics.map((metric) => {
            const chartData = getDataForPeriod(metric.id, selectedPeriod);
            
            return (
              <View key={metric.id} style={styles.chartContainer}>
                <HealthChart
                  data={Array.isArray(chartData) ? chartData : []}
                  title={metric.title}
                  unit={metric.unit}
                  color={metric.color}
                  period={selectedPeriod as 'day' | 'week' | 'month'}
                />
              </View>
            );
          })
        )}
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
    padding: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
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
    paddingHorizontal: 24,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  metricInfo: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  metricAvg: {
    fontSize: 14,
    color: '#666',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  sparklineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 35,
  },
  sparklineBar: {
    width: 3,
    backgroundColor: '#04A7F5',
    borderRadius: 1.5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartContainer: {
    marginBottom: 16,
  },
});