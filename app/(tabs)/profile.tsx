import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Bell, CircleHelp as HelpCircle, LogOut, ChevronRight, Settings } from 'lucide-react-native';
import { useState } from 'react';

export default function Profile() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            router.push('/onboarding');
          }
        }
      ]
    );
  };

  const MenuItem = ({ icon, title, onPress, hasSwitch = false, switchValue }: any) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={hasSwitch}
    >
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          {icon}
        </View>
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#e9ecef', true: '#04A7F5' }}
          thumbColor="#ffffff"
        />
      ) : (
        <ChevronRight size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <User size={32} color="#04A7F5" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Ahmed Al-Rashid</Text>
            <Text style={styles.userPhone}>+971 50 123 4567</Text>
            <Text style={styles.userRole}>Patient</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <MenuItem
            icon={<User size={20} color="#666" />}
            title="Account Information"
            onPress={() => Alert.alert('Info', 'Account information screen')}
          />
          
          <MenuItem
            icon={<Bell size={20} color="#666" />}
            title="Notifications"
            hasSwitch={true}
            switchValue={notificationsEnabled}
          />
          
          <MenuItem
            icon={<Settings size={20} color="#666" />}
            title="App Settings"
            onPress={() => Alert.alert('Info', 'App settings screen')}
          />
          
          <MenuItem
            icon={<HelpCircle size={20} color="#666" />}
            title="Help & FAQ"
            onPress={() => Alert.alert('Info', 'Help & FAQ screen')}
          />
          
          <MenuItem
            icon={<LogOut size={20} color="#ff4757" />}
            title="Logout"
            onPress={handleLogout}
          />
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f8fcff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#04A7F5',
    fontWeight: '500',
  },
  menuSection: {
    gap: 2,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
});