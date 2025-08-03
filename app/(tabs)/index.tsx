import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Heart, Droplets, Thermometer, Footprints, TriangleAlert as AlertTriangle, 
  User, Battery, Bell, TrendingUp, Users, Activity, Zap,
  ChevronRight, Clock, Shield, Target, AlertCircle
} from 'lucide-react-native';
import { generateMockVitals, getAverageVitals, VitalData, generateFamilyVitals, FamilyMember } from '../../data/mockVitals';

interface VitalData {
  heartRate: number;
  spO2: number;
  temperature: number;
  steps: number;
  timestamp: Date;
}

export default function Home() {
  const router = useRouter();
  const [vitals, setVitals] = useState<VitalData>({
    heartRate: 72,
    spO2: 98,
    temperature: 36.7,
    steps: 1234,
    timestamp: new Date(),
  });

  // Generate comprehensive mock data
  const [mockData] = useState(() => generateMockVitals(30)); // 30 days of data
  const [familyMembers] = useState(() => generateFamilyVitals());
  const [currentVitals] = useState(() => {
    const todayData = mockData.filter(vital => {
      const today = new Date();
      const vitalDate = new Date(vital.timestamp);
      return vitalDate.toDateString() === today.toDateString();
    });
    return getAverageVitals(todayData);
  });

  // Health score calculation
  const calculateHealthScore = () => {
    const heartRateScore = currentVitals.heartRate >= 60 && currentVitals.heartRate <= 100 ? 25 : 15;
    const spO2Score = currentVitals.spO2 >= 95 ? 25 : 15;
    const temperatureScore = currentVitals.temperature >= 36.0 && currentVitals.temperature <= 37.5 ? 25 : 15;
    const stepsScore = currentVitals.steps >= 8000 ? 25 : Math.floor((currentVitals.steps / 8000) * 25);
    
    return Math.min(100, heartRateScore + spO2Score + temperatureScore + stepsScore);
  };

  const healthScore = calculateHealthScore();

  // Weekly progress data
  const getWeeklyProgress = () => {
    const weekData = mockData.slice(-7 * 24); // Last 7 days
    const dailyAverages = [];
    
    for (let i = 0; i < 7; i++) {
      const dayData = weekData.filter(vital => {
        const vitalDate = new Date(vital.timestamp);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - (6 - i));
        return vitalDate.toDateString() === targetDate.toDateString();
      });
      dailyAverages.push(getAverageVitals(dayData));
    }
    
    return dailyAverages;
  };

  const weeklyData = getWeeklyProgress();

  // Personalized tips
  const getPersonalizedTip = () => {
    if (currentVitals.heartRate > 80) {
      return { tip: "Your heart rate is elevated. Consider taking a 5-minute walk", icon: "🚶‍♂️", color: "#ff6b6b" };
    } else if (currentVitals.steps < 5000) {
      return { tip: "You're below your daily step goal. Try a short walk!", icon: "👟", color: "#4ecdc4" };
    } else if (currentVitals.spO2 < 97) {
      return { tip: "Your oxygen levels are slightly low. Take deep breaths", icon: "🫁", color: "#45b7d1" };
    } else {
      return { tip: "Great job! Your vitals are looking healthy today", icon: "✅", color: "#51cf66" };
    }
  };

  const personalizedTip = getPersonalizedTip();

  // Enhanced recent alerts with better visual indicators
  const [recentAlerts] = useState([
    { 
      id: 1, 
      member: "Sarah", 
      type: "heart rate", 
      status: "elevated", 
      time: "2 hours ago", 
      severity: "high",
      value: "110 bpm",
      icon: "❤️‍🩹"
    },
    { 
      id: 2, 
      member: "Omar", 
      type: "temperature", 
      status: "slightly elevated", 
      time: "4 hours ago", 
      severity: "medium",
      value: "37.2°C",
      icon: "🌡️"
    },
    { 
      id: 3, 
      member: "You", 
      type: "steps", 
      status: "goal achieved", 
      time: "6 hours ago", 
      severity: "positive",
      value: "10,000 steps",
      icon: "🎯"
    },
  ]);

  // Device status - removed WiFi, focused on bracelet
  const [deviceStatus] = useState({
    bracelet: { battery: 85, connected: true, signal: 90 },
    lastSync: "2 minutes ago",
    syncStatus: "synced"
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        heartRate: prev.heartRate + Math.floor(Math.random() * 6) - 3,
        spO2: Math.max(95, Math.min(100, prev.spO2 + Math.floor(Math.random() * 3) - 1)),
        temperature: +(prev.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1),
        steps: prev.steps + Math.floor(Math.random() * 10),
        timestamp: new Date(),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSOS = () => {
    Alert.alert(
      'Emergency SOS',
      'This will alert your emergency contacts immediately. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: () => {
            Alert.alert('SOS Sent', 'Emergency alert sent to your contacts');
          }
        }
      ]
    );
  };

  const handleVitalPress = (metric: string) => {
    router.push({
      pathname: '/vital-detail',
      params: { metric, data: JSON.stringify(mockData) }
    });
  };

  const handleFamilyCheck = () => {
    router.push('/family-health');
  };

  const VitalCard = ({ icon, title, value, unit, color, onPress, trend }: any) => (
    <TouchableOpacity 
      style={[styles.vitalCard, { borderTopColor: color }]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        {icon}
        <Text style={styles.cardTitle}>{title}</Text>
        {trend && <TrendingUp size={16} color={trend === 'up' ? '#51cf66' : '#ff6b6b'} />}
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardUnit}>{unit}</Text>
    </TouchableOpacity>
  );

  const MiniChart = ({ data, color }: { data: number[], color: string }) => (
    <View style={styles.miniChart}>
      {data.map((value, index) => {
        const maxValue = Math.max(...data);
        const height = (value / maxValue) * 20;
        return (
          <View
            key={index}
            style={[
              styles.miniChartBar,
              { height, backgroundColor: color }
            ]}
          />
        );
      })}
    </View>
  );

  const AlertCard = ({ alert }: { alert: any }) => {
    const getSeverityColor = () => {
      switch (alert.severity) {
        case 'high': return '#ff4757';
        case 'medium': return '#ffa502';
        case 'positive': return '#51cf66';
        default: return '#ff6b6b';
      }
    };

    const getSeverityBackground = () => {
      switch (alert.severity) {
        case 'high': return '#fff5f5';
        case 'medium': return '#fff9f0';
        case 'positive': return '#f0fff4';
        default: return '#fff5f5';
      }
    };

    return (
      <View style={[
        styles.alertCard, 
        { 
          borderLeftColor: getSeverityColor(),
          backgroundColor: getSeverityBackground()
        }
      ]}>
        <View style={styles.alertIconContainer}>
          <Text style={styles.alertEmoji}>{alert.icon}</Text>
          <AlertCircle size={16} color={getSeverityColor()} />
        </View>
        <View style={styles.alertContent}>
          <Text style={styles.alertText}>
            <Text style={styles.alertMember}>{alert.member}</Text>'s {alert.type} was {alert.status}
          </Text>
          <Text style={styles.alertValue}>{alert.value}</Text>
          <Text style={styles.alertTime}>{alert.time}</Text>
        </View>
        <View style={styles.alertActions}>
          <TouchableOpacity style={[styles.alertButton, { backgroundColor: getSeverityColor() }]}>
            <Text style={styles.alertButtonText}>View</Text>
          </TouchableOpacity>
          <ChevronRight size={16} color="#ccc" />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.name}>Ahmed</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={20} color="#666" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <User size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Score */}
        <View style={styles.healthScoreCard}>
          <View style={styles.healthScoreHeader}>
            <Text style={styles.healthScoreTitle}>Health Score</Text>
            <Target size={20} color="#04A7F5" />
          </View>
          <View style={styles.healthScoreContent}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{healthScore}</Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
            <View style={styles.scoreDetails}>
              <Text style={styles.scoreStatus}>
                {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
              </Text>
              <Text style={styles.scoreDescription}>
                {healthScore >= 80 ? 'Keep up the great work!' : 'A few adjustments can improve your score'}
              </Text>
            </View>
          </View>
        </View>

        {/* Personalized Tip */}
        <View style={[styles.tipCard, { borderLeftColor: personalizedTip.color }]}>
          <Text style={styles.tipIcon}>{personalizedTip.icon}</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Health Tip</Text>
            <Text style={styles.tipText}>{personalizedTip.tip}</Text>
          </View>
        </View>

        {/* Current Vitals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Vitals</Text>
          <View style={styles.vitalsGrid}>
            <VitalCard
              icon={<Heart size={24} color="#ff4757" />}
              title="Heart Rate"
              value={currentVitals.heartRate}
              unit="bpm"
              color="#ff4757"
              onPress={() => handleVitalPress('heartRate')}
              trend={currentVitals.heartRate > 75 ? 'up' : 'down'}
            />
            <VitalCard
              icon={<Droplets size={24} color="#04A7F5" />}
              title="SpO₂"
              value={currentVitals.spO2}
              unit="%"
              color="#04A7F5"
              onPress={() => handleVitalPress('spO2')}
              trend="stable"
            />
            <VitalCard
              icon={<Thermometer size={24} color="#ffa502" />}
              title="Temperature"
              value={currentVitals.temperature}
              unit="°C"
              color="#ffa502"
              onPress={() => handleVitalPress('temperature')}
              trend="stable"
            />
            <VitalCard
              icon={<Footprints size={24} color="#2ed573" />}
              title="Steps"
              value={currentVitals.steps.toLocaleString()}
              unit="today"
              color="#2ed573"
              onPress={() => handleVitalPress('steps')}
              trend="up"
            />
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.weeklyProgress}>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Heart size={16} color="#ff4757" />
                <Text style={styles.progressTitle}>Heart Rate</Text>
              </View>
              <MiniChart data={weeklyData.map(d => d.heartRate)} color="#ff4757" />
            </View>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Droplets size={16} color="#04A7F5" />
                <Text style={styles.progressTitle}>SpO₂</Text>
              </View>
              <MiniChart data={weeklyData.map(d => d.spO2)} color="#04A7F5" />
            </View>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Footprints size={16} color="#2ed573" />
                <Text style={styles.progressTitle}>Steps</Text>
              </View>
              <MiniChart data={weeklyData.map(d => d.steps / 1000)} color="#2ed573" />
            </View>
          </View>
        </View>

        {/* Quick Family Check */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Family Status</Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={handleFamilyCheck}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#04A7F5" />
            </TouchableOpacity>
          </View>
          <View style={styles.familyOverview}>
            {familyMembers.slice(0, 3).map((member) => {
              const avgVitals = getAverageVitals(member.vitals);
              return (
                <View key={member.id} style={styles.familyMember}>
                  <Text style={styles.memberAvatar}>{member.avatar}</Text>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberStatus}>
                      {avgVitals.heartRate > 80 ? '⚠️ Elevated' : '✅ Healthy'}
                    </Text>
                  </View>
                  <View style={styles.memberVitals}>
                    <Text style={styles.memberVital}>{avgVitals.heartRate} bpm</Text>
                    <Text style={styles.memberVital}>{avgVitals.spO2}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Enhanced Recent Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>{recentAlerts.length}</Text>
            </View>
          </View>
          {recentAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </View>

        {/* Device Status - Removed WiFi, focused on bracelet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Status</Text>
          <View style={styles.deviceStatus}>
            <View style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <Battery size={20} color="#51cf66" />
                <Text style={styles.deviceTitle}>Bracelet</Text>
              </View>
              <Text style={styles.deviceValue}>{deviceStatus.bracelet.battery}%</Text>
              <Text style={styles.deviceStatus}>
                {deviceStatus.bracelet.connected ? '🟢 Connected' : '🔴 Disconnected'}
              </Text>
            </View>
            <View style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <Activity size={20} color="#ffa502" />
                <Text style={styles.deviceTitle}>Last Sync</Text>
              </View>
              <Text style={styles.deviceValue}>{deviceStatus.lastSync}</Text>
              <Text style={styles.deviceStatus}>🟢 {deviceStatus.syncStatus}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
        <AlertTriangle size={28} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b6b',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  healthScoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  healthScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthScoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  healthScoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#04A7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  scoreMax: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#04A7F5',
    fontWeight: '500',
  },
  alertBadge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  alertBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderTopWidth: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    flex: 1,
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardUnit: {
    fontSize: 10,
    color: '#666',
  },
  weeklyProgress: {
    flexDirection: 'row',
    gap: 12,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 30,
    gap: 2,
  },
  miniChartBar: {
    flex: 1,
    borderRadius: 1,
  },
  familyOverview: {
    gap: 12,
  },
  familyMember: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  memberAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  memberStatus: {
    fontSize: 12,
    color: '#666',
  },
  memberVitals: {
    alignItems: 'flex-end',
  },
  memberVital: {
    fontSize: 12,
    color: '#666',
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertIconContainer: {
    marginRight: 12,
    alignItems: 'center',
  },
  alertEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  alertContent: {
    flex: 1,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  alertMember: {
    fontWeight: '600',
  },
  alertValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#666',
  },
  alertActions: {
    alignItems: 'center',
    gap: 8,
  },
  alertButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  alertButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  deviceStatus: {
    flexDirection: 'row',
    gap: 12,
  },
  deviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  deviceTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  deviceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 10,
    color: '#666',
  },
  sosButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ff4757',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});