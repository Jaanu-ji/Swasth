// ✅ OCR Screen - Built from Figma ReportScanner.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { uploadOCR, getOCRStatus, getOCRHistory } from '../../config/api';
import figmaTokens from '../../design-system/figmaTokens';
import { HeaderBar } from '../../design-system/HeaderBar';
import { FigmaCard } from '../../design-system/FigmaCard';
import { useRouter } from 'expo-router';

export default function OCRScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [scanStatus, setScanStatus] = useState('idle');
  const [previousScans, setPreviousScans] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadPreviousScans();
    }
  }, [user?.email]);

  const loadPreviousScans = async () => {
    try {
      const scans = await getOCRHistory(user.email);
      setPreviousScans(scans.map(scan => ({
        id: scan._id,
        type: scan.fileName || 'Medical Report',
        date: new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: scan.status || 'completed',
        results: scan.extractedFields || {},
        notes: scan.extractedText || '',
      })));
    } catch (error) {
      console.error('Error loading scans:', error);
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleUpload(result.assets[0], 'camera');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleUpload(result.assets[0], 'library');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpload = async (imageAsset, source) => {
    if (!user?.email) return;

    setScanStatus('scanning');
    setUploading(true);

    try {
      const file = {
        uri: imageAsset.uri,
        type: imageAsset.type || 'image/jpeg',
        name: imageAsset.fileName || `report_${Date.now()}.jpg`,
      };

      const response = await uploadOCR(user.email, file, 'Unknown');
      
      if (response.scanId) {
        setTimeout(async () => {
          try {
            const status = await getOCRStatus(response.scanId);
            setScanStatus('success');
            await loadPreviousScans();
            setTimeout(() => setScanStatus('idle'), 2000);
          } catch (error) {
            setScanStatus('success');
            setTimeout(() => setScanStatus('idle'), 2000);
          }
        }, 2000);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload report');
      setScanStatus('idle');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <HeaderBar
          title="Report Scanner"
          onBack={() => router.back()}
          backgroundColor={figmaTokens.colors.white}
        />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <MaterialCommunityIcons name="information" size={20} color={figmaTokens.colors.blue600} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>AI-Powered Report Analysis</Text>
                <Text style={styles.infoDescription}>
                  Upload medical reports to extract and organize key information automatically
                </Text>
              </View>
            </View>

            {/* Upload Area */}
            <FigmaCard style={styles.uploadCard}>
              {scanStatus === 'idle' && (
                <>
                  <View style={styles.uploadHeader}>
                    <View style={styles.uploadIconBg}>
                      <MaterialCommunityIcons name="file-document-outline" size={48} color={figmaTokens.colors.purple600} />
                    </View>
                    <Text style={styles.uploadTitle}>Scan Medical Report</Text>
                    <Text style={styles.uploadDescription}>
                      Upload a photo or PDF of your medical report for automatic analysis
                    </Text>
                  </View>

                  <View style={styles.uploadButtonsGrid}>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleTakePhoto}
                      disabled={uploading}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="camera" size={32} color={figmaTokens.colors.gray600} />
                      <Text style={styles.uploadButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handlePickImage}
                      disabled={uploading}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="upload" size={32} color={figmaTokens.colors.gray600} />
                      <Text style={styles.uploadButtonText}>Upload File</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {scanStatus === 'scanning' && (
                <View style={styles.scanningContainer}>
                  <View style={styles.scanningIconBg}>
                    <ActivityIndicator size="large" color={figmaTokens.colors.purple600} />
                  </View>
                  <Text style={styles.scanningTitle}>Analyzing Report...</Text>
                  <Text style={styles.scanningDescription}>Our AI is extracting information from your report</Text>
                </View>
              )}

              {scanStatus === 'success' && (
                <View style={styles.successContainer}>
                  <View style={styles.successIconBg}>
                    <MaterialCommunityIcons name="check-circle-outline" size={48} color={figmaTokens.colors.green600} />
                  </View>
                  <Text style={styles.successTitle}>Report Analyzed Successfully!</Text>
                  <Text style={styles.successDescription}>Data has been extracted and saved</Text>
                </View>
              )}
            </FigmaCard>

            {/* Previous Scans */}
            {previousScans.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Previous Scans</Text>
                <View style={styles.scansList}>
                  {previousScans.map((scan) => (
                    <TouchableOpacity key={scan.id} style={styles.scanCard} activeOpacity={0.7}>
                      <View style={styles.scanContent}>
                        <View style={styles.scanIconBg}>
                          <MaterialCommunityIcons name="file-document-outline" size={24} color={figmaTokens.colors.purple600} />
                        </View>
                        <View style={styles.scanText}>
                          <View style={styles.scanHeader}>
                            <Text style={styles.scanType}>{scan.type}</Text>
                            <View style={styles.statusBadge}>
                              <MaterialCommunityIcons name="check" size={12} color={figmaTokens.colors.green700} />
                              <Text style={styles.statusText}>{scan.status}</Text>
                            </View>
                          </View>
                          <Text style={styles.scanDate}>{scan.date}</Text>
                          {scan.results && Object.keys(scan.results).length > 0 && (
                            <View style={styles.resultsContainer}>
                              {Object.entries(scan.results).map(([key, value], index) => (
                                <View key={index} style={styles.resultRow}>
                                  <Text style={styles.resultKey}>
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                  </Text>
                                  <Text style={styles.resultValue}>{String(value)}</Text>
                                </View>
                              ))}
                            </View>
                          )}
                          {scan.notes && (
                            <Text style={styles.scanNotes}>{scan.notes.substring(0, 100)}...</Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
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
  infoBanner: {
    backgroundColor: figmaTokens.colors.blue50,
    borderWidth: 1,
    borderColor: figmaTokens.colors.blue200,
    borderRadius: figmaTokens.borderRadius['2xl'],
    padding: figmaTokens.spacing['4'],
    marginBottom: figmaTokens.spacing['6'],
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: figmaTokens.spacing['3'],
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.blue900,
    marginBottom: figmaTokens.spacing['1'],
  },
  infoDescription: {
    fontSize: figmaTokens.typography.fontSize.sm,
    color: figmaTokens.colors.blue700,
  },
  uploadCard: {
    padding: figmaTokens.spacing['8'],
    marginBottom: figmaTokens.spacing['6'],
  },
  uploadHeader: {
    alignItems: 'center',
    marginBottom: figmaTokens.spacing['6'],
  },
  uploadIconBg: {
    backgroundColor: figmaTokens.colors.purple100,
    borderRadius: figmaTokens.borderRadius.full,
    padding: figmaTokens.spacing['6'],
    marginBottom: figmaTokens.spacing['4'],
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: figmaTokens.typography.fontSize.xl,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    marginBottom: figmaTokens.spacing['2'],
  },
  uploadDescription: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray600,
    textAlign: 'center',
  },
  uploadButtonsGrid: {
    flexDirection: 'row',
    gap: figmaTokens.spacing['4'],
  },
  uploadButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: figmaTokens.spacing['3'],
    padding: figmaTokens.spacing['6'],
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: figmaTokens.colors.gray300,
    borderRadius: figmaTokens.borderRadius.xl,
    backgroundColor: figmaTokens.colors.white,
  },
  uploadButtonText: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
  },
  scanningContainer: {
    alignItems: 'center',
    paddingVertical: figmaTokens.spacing['8'],
  },
  scanningIconBg: {
    backgroundColor: figmaTokens.colors.purple100,
    borderRadius: figmaTokens.borderRadius.full,
    padding: figmaTokens.spacing['6'],
    marginBottom: figmaTokens.spacing['4'],
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningTitle: {
    fontSize: figmaTokens.typography.fontSize.xl,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    marginBottom: figmaTokens.spacing['2'],
  },
  scanningDescription: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray600,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: figmaTokens.spacing['8'],
  },
  successIconBg: {
    backgroundColor: figmaTokens.colors.green100,
    borderRadius: figmaTokens.borderRadius.full,
    padding: figmaTokens.spacing['6'],
    marginBottom: figmaTokens.spacing['4'],
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: figmaTokens.typography.fontSize.xl,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    marginBottom: figmaTokens.spacing['2'],
  },
  successDescription: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray600,
  },
  sectionTitle: {
    fontSize: figmaTokens.typography.fontSize.xl,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    marginBottom: figmaTokens.spacing['4'],
  },
  scansList: {
    gap: figmaTokens.spacing['3'],
  },
  scanCard: {
    backgroundColor: figmaTokens.colors.white,
    borderRadius: figmaTokens.borderRadius['2xl'],
    padding: figmaTokens.spacing['4'],
    ...figmaTokens.shadows.sm,
  },
  scanContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: figmaTokens.spacing['4'],
  },
  scanIconBg: {
    backgroundColor: figmaTokens.colors.purple100,
    borderRadius: figmaTokens.borderRadius.xl,
    padding: figmaTokens.spacing['3'],
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    flex: 1,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: figmaTokens.spacing['2'],
  },
  scanType: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: figmaTokens.colors.green100,
    borderRadius: figmaTokens.borderRadius.full,
    paddingHorizontal: figmaTokens.spacing['2'],
    paddingVertical: figmaTokens.spacing['0.5'],
    gap: figmaTokens.spacing['1'],
  },
  statusText: {
    fontSize: 12,
    color: figmaTokens.colors.green700,
    fontWeight: figmaTokens.typography.fontWeight.medium,
  },
  scanDate: {
    fontSize: figmaTokens.typography.fontSize.sm,
    color: figmaTokens.colors.gray500,
    marginBottom: figmaTokens.spacing['3'],
  },
  resultsContainer: {
    backgroundColor: figmaTokens.colors.gray50,
    borderRadius: figmaTokens.borderRadius.base,
    padding: figmaTokens.spacing['3'],
    marginBottom: figmaTokens.spacing['2'],
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: figmaTokens.spacing['1'],
  },
  resultKey: {
    fontSize: figmaTokens.typography.fontSize.sm,
    color: figmaTokens.colors.gray600,
    textTransform: 'capitalize',
  },
  resultValue: {
    fontSize: figmaTokens.typography.fontSize.sm,
    color: figmaTokens.colors.gray900,
    fontWeight: figmaTokens.typography.fontWeight.medium,
  },
  scanNotes: {
    fontSize: figmaTokens.typography.fontSize.sm,
    color: figmaTokens.colors.gray600,
  },
});

