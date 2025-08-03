import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

interface ChartDataPoint {
  value: number;
  timestamp: Date;
}

interface HealthChartProps {
  data: ChartDataPoint[];
  title: string;
  unit: string;
  color: string;
  type?: 'line' | 'bar';
  period: 'day' | 'week' | 'month';
}

const { width } = Dimensions.get('window');

export default function HealthChart({ data, title, unit, color, type = 'line', period }: HealthChartProps) {
  const formatData = () => {
    if (data.length === 0) return { labels: [], datasets: [{ data: [] }] };

    // Group data by time period with better formatting
    let groupedData: { [key: string]: number[] } = {};
    
    data.forEach(point => {
      let key: string;
      const date = point.timestamp;
      
      if (period === 'day') {
        // Show only key hours for day view
        const hour = date.getHours();
        if (hour % 3 === 0) { // Show every 3rd hour
          key = `${hour.toString().padStart(2, '0')}:00`;
        } else {
          key = `${hour.toString().padStart(2, '0')}:00`;
        }
      } else if (period === 'week') {
        key = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        // For month view, show only key dates
        const day = date.getDate();
        if (day % 7 === 0 || day === 1) { // Show 1st and every 7th day
          key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
          key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      }
      
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(point.value);
    });

    // Calculate averages for each period
    const labels = Object.keys(groupedData);
    const values = labels.map(key => {
      const values = groupedData[key];
      return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
    });

    // Filter out empty or duplicate labels for better readability
    const uniqueLabels = labels.filter((label, index) => {
      if (period === 'day') {
        // For day view, show only every 3rd label to prevent overlap
        return index % 3 === 0;
      } else if (period === 'month') {
        // For month view, show only key dates
        return index % 7 === 0 || index === 0;
      }
      return true;
    });

    const filteredValues = values.filter((_, index) => {
      if (period === 'day') {
        return index % 3 === 0;
      } else if (period === 'month') {
        return index % 7 === 0 || index === 0;
      }
      return true;
    });

    return {
      labels: uniqueLabels,
      datasets: [{ data: filteredValues }]
    };
  };

  const chartData = formatData();
  const averageValue = chartData.datasets[0].data.length > 0 
    ? Math.round(chartData.datasets[0].data.reduce((sum, val) => sum + val, 0) / chartData.datasets[0].data.length)
    : 0;

  // Convert hex color to RGB for chart
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbColor = hexToRgb(color);

  // Dynamic Y-axis configuration based on data
  const getYAxisConfig = () => {
    if (chartData.datasets[0].data.length === 0) return {};
    
    const values = chartData.datasets[0].data;
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    
    // Add padding to prevent data from touching edges
    const padding = range * 0.1;
    const yMin = Math.max(0, minValue - padding);
    const yMax = maxValue + padding;
    
    return {
      yAxisMin: yMin,
      yAxisMax: yMax,
    };
  };

  const yAxisConfig = getYAxisConfig();

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: color,
    },
    // Improved grid configuration
    propsForBackgroundLines: {
      strokeDasharray: '', // Solid lines instead of dashed
      strokeWidth: 0.5,
      stroke: 'rgba(0, 0, 0, 0.1)',
    },
    // Better label formatting
    formatYLabel: (value: string) => {
      const num = parseFloat(value);
      if (title.toLowerCase().includes('steps')) {
        return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
      }
      return num.toString();
    },
    ...yAxisConfig,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.averageContainer}>
          <Text style={styles.averageLabel}>Average:</Text>
          <Text style={[styles.averageValue, { color }]}>{averageValue} {unit}</Text>
        </View>
      </View>
      
      {chartData.datasets[0].data.length > 0 ? (
        <View style={styles.chartContainer}>
          {type === 'line' ? (
            <LineChart
              data={chartData}
              width={width - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withDots={true}
              withShadow={false}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
            />
          ) : (
            <BarChart
              data={chartData}
              width={width - 48}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=""
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
            />
          )}
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data available for this period</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  averageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  averageLabel: {
    fontSize: 14,
    color: '#666',
  },
  averageValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
}); 