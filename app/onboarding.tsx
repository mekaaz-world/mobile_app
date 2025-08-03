import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Users } from 'lucide-react-native';

export default function Onboarding() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'family' | null>(null);

  const handleRoleSelect = (role: 'patient' | 'family') => {
    setSelectedRole(role);
    // Store role for later use
    // In a real app, you'd store this in AsyncStorage or context
    setTimeout(() => {
      router.push('/auth');
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to HealthMon</Text>
          <Text style={styles.subtitle}>Choose your role to continue</Text>
        </View>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'patient' && styles.selectedCard]}
            onPress={() => handleRoleSelect('patient')}
          >
            <View style={styles.iconContainer}>
              <User size={48} color={selectedRole === 'patient' ? '#04A7F5' : '#666'} />
            </View>
            <Text style={styles.roleTitle}>Patient</Text>
            <Text style={styles.roleDescription}>Monitor your health vitals</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'family' && styles.selectedCard]}
            onPress={() => handleRoleSelect('family')}
          >
            <View style={styles.iconContainer}>
              <Users size={48} color={selectedRole === 'family' ? '#04A7F5' : '#666'} />
            </View>
            <Text style={styles.roleTitle}>Family Member</Text>
            <Text style={styles.roleDescription}>Care for your loved ones</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  roleContainer: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#04A7F5',
    backgroundColor: '#f8fcff',
  },
  iconContainer: {
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});