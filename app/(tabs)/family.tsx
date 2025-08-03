import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Copy, Plus, X, Check, Heart, Droplets, Thermometer, Footprints, ChevronRight } from 'lucide-react-native';
import { generateFamilyVitals, getAverageVitals, FamilyMember } from '../../data/mockVitals';

interface PendingInvite {
  id: string;
  from: string;
  patientName: string;
}

export default function Family() {
  const router = useRouter();
  const [inviteCode] = useState('ABCD-1234');
  const [familyMembers] = useState<FamilyMember[]>(() => generateFamilyVitals());
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([
    { id: '1', from: '+971501234567', patientName: 'Fatima Al-Zahra' }
  ]);

  const handleCopyCode = () => {
    // In a real app, copy to clipboard
    Alert.alert('Copied', 'Invite code copied to clipboard');
  };

  const handleRemoveMember = (id: string) => {
    Alert.alert(
      'Remove Family Member',
      'Are you sure you want to remove this family member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // In a real app, remove from state
            Alert.alert('Removed', 'Family member removed successfully');
          }
        }
      ]
    );
  };

  const handleAcceptInvite = (id: string) => {
    setPendingInvites(prev => prev.filter(invite => invite.id !== id));
    Alert.alert('Success', 'Invite accepted! You can now monitor their health.');
  };

  const handleDeclineInvite = (id: string) => {
    setPendingInvites(prev => prev.filter(invite => invite.id !== id));
  };

  const handleViewFamilyHealth = (member: FamilyMember) => {
    router.push({
      pathname: '/family-health',
      params: { 
        memberId: member.id,
        memberName: member.name,
        memberRole: member.role,
        data: JSON.stringify(member.vitals)
      }
    });
  };

  const FamilyMemberCard = ({ member }: { member: FamilyMember }) => {
    const avgVitals = getAverageVitals(member.vitals);
    
    return (
      <View style={styles.memberCard}>
        <View style={styles.memberInfo}>
          <Text style={styles.memberAvatar}>{member.avatar}</Text>
          <View style={styles.memberDetails}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberRole}>{member.role}</Text>
          </View>
        </View>
        
        <View style={styles.memberVitals}>
          <View style={styles.vitalItem}>
            <Heart size={16} color="#ff4757" />
            <Text style={styles.vitalValue}>{avgVitals.heartRate}</Text>
          </View>
          <View style={styles.vitalItem}>
            <Droplets size={16} color="#04A7F5" />
            <Text style={styles.vitalValue}>{avgVitals.spO2}%</Text>
          </View>
          <View style={styles.vitalItem}>
            <Thermometer size={16} color="#ffa502" />
            <Text style={styles.vitalValue}>{avgVitals.temperature}°</Text>
          </View>
        </View>

        <View style={styles.memberActions}>
          <TouchableOpacity
            style={styles.viewHealthButton}
            onPress={() => handleViewFamilyHealth(member)}
          >
            <Text style={styles.viewHealthText}>View Health</Text>
            <ChevronRight size={16} color="#04A7F5" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveMember(member.id)}
          >
            <X size={16} color="#ff4757" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Family Connections</Text>
        <Text style={styles.subtitle}>Manage your care network</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Invites</Text>
            {pendingInvites.map((invite) => (
              <View key={invite.id} style={styles.inviteCard}>
                <View style={styles.inviteInfo}>
                  <Text style={styles.inviteText}>
                    <Text style={styles.inviteName}>{invite.patientName}</Text> wants to connect
                  </Text>
                  <Text style={styles.inviteFrom}>From: {invite.from}</Text>
                </View>
                <View style={styles.inviteActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAcceptInvite(invite.id)}
                  >
                    <Check size={16} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.declineButton]}
                    onPress={() => handleDeclineInvite(invite.id)}
                  >
                    <X size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Invite Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share Invite Code</Text>
          <View style={styles.inviteCodeCard}>
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Your invite code</Text>
              <Text style={styles.codeText}>{inviteCode}</Text>
            </View>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <Copy size={20} color="#04A7F5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Family Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Family</Text>
          {familyMembers.map((member) => (
            <FamilyMemberCard key={member.id} member={member} />
          ))}
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  inviteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 12,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  inviteName: {
    fontWeight: '600',
  },
  inviteFrom: {
    fontSize: 14,
    color: '#666',
  },
  inviteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#2ed573',
  },
  declineButton: {
    backgroundColor: '#ff4757',
  },
  inviteCodeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
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
  codeContainer: {
    flex: 1,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#04A7F5',
    letterSpacing: 2,
  },
  copyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fcff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberAvatar: {
    fontSize: 32,
    marginRight: 16,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  memberVitals: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  vitalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vitalValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewHealthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  viewHealthText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#04A7F5',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});