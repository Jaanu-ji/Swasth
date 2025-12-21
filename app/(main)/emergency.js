// ✅ Emergency Card Screen - Built from Figma EmergencyCard.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { getEmergencyCard, createEmergencyCard } from '../../config/api';
import figmaTokens from '../../design-system/figmaTokens';
import { HeaderBar } from '../../design-system/HeaderBar';
import { FigmaCard } from '../../design-system/FigmaCard';
import { useRouter } from 'expo-router';

export default function EmergencyCardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadCard();
    }
  }, [user?.email]);

  const loadCard = async () => {
    try {
      const data = await getEmergencyCard(user.email);
      setCard(data);
    } catch (error) {
      console.error('Error loading emergency card:', error);
    }
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmergencyCall = () => {
    Linking.openURL('tel:911');
  };

  const displayCard = card || {
    personalInfo: {
      name: user?.name || 'User',
      age: user?.age || 'N/A',
      bloodType: 'A+',
      height: user?.height ? `${user.height} cm` : '165 cm',
      weight: user?.weight ? `${user.weight} kg` : '68 kg',
      photo: null,
    },
    emergencyContacts: [
      { name: 'John Johnson', relationship: 'Spouse', phone: '+1 (555) 123-4567' },
    ],
    medicalInfo: {
      allergies: ['Penicillin', 'Peanuts'],
      conditions: ['Hypertension'],
      medications: ['Lisinopril 10mg'],
    },
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <HeaderBar
          title="Emergency Card"
          onBack={() => router.back()}
          rightIcon="pencil"
          onRightPress={() => console.log('Edit Emergency Card')}
          backgroundColor={figmaTokens.colors.white}
        />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Alert Banner */}
            <View style={styles.alertBanner}>
              <MaterialCommunityIcons name="alert-circle" size={24} color={figmaTokens.colors.white} />
              <View style={styles.alertContent}>
                <Text style={styles.alertText}>This card contains critical medical information</Text>
                <Text style={styles.alertSubtext}>Show to emergency responders if needed</Text>
              </View>
            </View>

            {/* Personal Information */}
            <FigmaCard style={styles.card}>
              <View style={styles.personalInfo}>
                <View style={styles.avatarContainer}>
                  {displayCard.personalInfo.photo ? (
                    <Image source={{ uri: displayCard.personalInfo.photo }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <MaterialCommunityIcons name="account" size={40} color={figmaTokens.colors.gray500} />
                    </View>
                  )}
                </View>
                <View>
                  <Text style={styles.name}>{displayCard.personalInfo.name}</Text>
                  <Text style={styles.age}>{displayCard.personalInfo.age} years old</Text>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={[styles.infoBox, { backgroundColor: figmaTokens.colors.red50 }]}>
                  <MaterialCommunityIcons name="water" size={24} color={figmaTokens.colors.red600} style={styles.infoIcon} />
                  <Text style={styles.infoLabel}>Blood Type</Text>
                  <Text style={styles.infoValue}>{displayCard.personalInfo.bloodType}</Text>
                </View>
                <View style={[styles.infoBox, { backgroundColor: figmaTokens.colors.blue50 }]}>
                  <MaterialCommunityIcons name="human-male-height" size={24} color={figmaTokens.colors.blue600} style={styles.infoIcon} />
                  <Text style={styles.infoLabel}>Height / Weight</Text>
                  <Text style={styles.infoValue}>{displayCard.personalInfo.height}</Text>
                  <Text style={styles.infoValue}>{displayCard.personalInfo.weight}</Text>
                </View>
              </View>
            </FigmaCard>

            {/* Emergency Contacts */}
            <FigmaCard style={styles.card}>
              <Text style={styles.sectionTitle}>Emergency Contacts</Text>
              <View style={styles.contactsList}>
                {displayCard.emergencyContacts.map((contact, index) => (
                  <View key={index} style={styles.contactItem}>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactRelation}>{contact.relationship}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => handleCall(contact.phone)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="phone" size={20} color={figmaTokens.colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </FigmaCard>

            {/* Medical Information */}
            <FigmaCard style={styles.card}>
              <Text style={styles.sectionTitle}>Medical Information</Text>

              <View style={styles.medicalSection}>
                <View style={styles.medicalLabelRow}>
                  <MaterialCommunityIcons name="alert-circle" size={20} color={figmaTokens.colors.red600} />
                  <Text style={styles.medicalLabel}>Allergies</Text>
                </View>
                <View style={styles.tagsContainer}>
                  {displayCard.medicalInfo.allergies.map((allergy, index) => (
                    <View key={index} style={styles.allergyTag}>
                      <Text style={styles.allergyText}>{allergy}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.medicalSection}>
                <View style={styles.medicalLabelRow}>
                  <MaterialCommunityIcons name="heart" size={20} color={figmaTokens.colors.orange600} />
                  <Text style={styles.medicalLabel}>Medical Conditions</Text>
                </View>
                <View style={styles.tagsContainer}>
                  {displayCard.medicalInfo.conditions.map((condition, index) => (
                    <View key={index} style={styles.conditionTag}>
                      <Text style={styles.conditionText}>{condition}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.medicalSection}>
                <View style={styles.medicalLabelRow}>
                  <MaterialCommunityIcons name="pill" size={20} color={figmaTokens.colors.blue600} />
                  <Text style={styles.medicalLabel}>Current Medications</Text>
                </View>
                <View style={styles.medicationsList}>
                  {displayCard.medicalInfo.medications.map((med, index) => (
                    <View key={index} style={styles.medicationItem}>
                      <Text style={styles.medicationText}>{med}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </FigmaCard>

            {/* Emergency Button */}
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={handleEmergencyCall}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="phone" size={20} color={figmaTokens.colors.white} />
              <Text style={styles.emergencyButtonText}>Call Emergency Services</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: figmaTokens.colors.gray50,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: figmaTokens.spacing['6'],
  },
  alertBanner: {
    backgroundColor: figmaTokens.colors.red500,
    borderRadius: figmaTokens.borderRadius['2xl'],
    padding: figmaTokens.spacing['4'],
    marginBottom: figmaTokens.spacing['6'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: figmaTokens.spacing['3'],
  },
  alertContent: {
    flex: 1,
  },
  alertText: {
    color: figmaTokens.colors.white,
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    marginBottom: figmaTokens.spacing['1'],
  },
  alertSubtext: {
    color: figmaTokens.colors.red100,
    fontSize: figmaTokens.typography.fontSize.sm,
  },
  card: {
    marginBottom: figmaTokens.spacing['6'],
  },
  personalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: figmaTokens.spacing['4'],
    marginBottom: figmaTokens.spacing['6'],
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: figmaTokens.colors.gray200,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: figmaTokens.typography.fontSize.xl,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    marginBottom: figmaTokens.spacing['1'],
  },
  age: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray500,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: figmaTokens.spacing['4'],
  },
  infoBox: {
    flex: 1,
    borderRadius: figmaTokens.borderRadius.xl,
    padding: figmaTokens.spacing['4'],
    alignItems: 'center',
  },
  infoIcon: {
    marginBottom: figmaTokens.spacing['2'],
  },
  infoLabel: {
    fontSize: figmaTokens.typography.fontSize.sm,
    color: figmaTokens.colors.gray500,
    marginBottom: figmaTokens.spacing['1'],
  },
  infoValue: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
  },
  sectionTitle: {
    fontSize: figmaTokens.typography.fontSize.xl,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    marginBottom: figmaTokens.spacing['4'],
  },
  contactsList: {
    gap: figmaTokens.spacing['3'],
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: figmaTokens.spacing['3'],
    backgroundColor: figmaTokens.colors.gray50,
    borderRadius: figmaTokens.borderRadius.xl,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    marginBottom: figmaTokens.spacing['1'],
  },
  contactRelation: {
    fontSize: figmaTokens.typography.fontSize.sm,
    color: figmaTokens.colors.gray500,
  },
  callButton: {
    backgroundColor: figmaTokens.colors.green500,
    borderRadius: figmaTokens.borderRadius.full,
    padding: figmaTokens.spacing['3'],
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicalSection: {
    marginBottom: figmaTokens.spacing['4'],
  },
  medicalLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: figmaTokens.spacing['2'],
    marginBottom: figmaTokens.spacing['2'],
  },
  medicalLabel: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: figmaTokens.spacing['2'],
  },
  allergyTag: {
    backgroundColor: figmaTokens.colors.red100,
    paddingHorizontal: figmaTokens.spacing['3'],
    paddingVertical: figmaTokens.spacing['1.5'],
    borderRadius: figmaTokens.borderRadius.full,
  },
  allergyText: {
    color: figmaTokens.colors.red700,
    fontSize: figmaTokens.typography.fontSize.sm,
  },
  conditionTag: {
    backgroundColor: figmaTokens.colors.orange100,
    paddingHorizontal: figmaTokens.spacing['3'],
    paddingVertical: figmaTokens.spacing['1.5'],
    borderRadius: figmaTokens.borderRadius.full,
  },
  conditionText: {
    color: figmaTokens.colors.orange700,
    fontSize: figmaTokens.typography.fontSize.sm,
  },
  medicationsList: {
    gap: figmaTokens.spacing['2'],
  },
  medicationItem: {
    backgroundColor: figmaTokens.colors.blue50,
    paddingHorizontal: figmaTokens.spacing['3'],
    paddingVertical: figmaTokens.spacing['2'],
    borderRadius: figmaTokens.borderRadius.base,
  },
  medicationText: {
    color: figmaTokens.colors.blue900,
    fontSize: figmaTokens.typography.fontSize.base,
  },
  emergencyButton: {
    width: '100%',
    backgroundColor: figmaTokens.colors.red500,
    paddingVertical: figmaTokens.spacing['4'],
    borderRadius: figmaTokens.borderRadius['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: figmaTokens.spacing['2'],
    ...figmaTokens.shadows.lg,
  },
  emergencyButtonText: {
    color: figmaTokens.colors.white,
    fontSize: figmaTokens.typography.fontSize.lg,
    fontWeight: figmaTokens.typography.fontWeight.medium,
  },
});

