import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Colors from '../constants/colors';
import { useAttendance } from '../hooks/useAttendance';

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

const calcDuration = (start, end) => {
  const diff = (new Date(end) - new Date(start)) / 60000;
  const h = Math.floor(diff / 60);
  const m = Math.round(diff % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export default function DashBoardScreen({ navigation }) {
  const {
    user,
    isRunning,
    loading,
    history,
    historyLoading,
    refreshing,
    onRefresh,
    handleAttendance,
    handleLogout,
  } = useAttendance(navigation);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || 'Employee'}</Text>
          {user?.employeeId && (
            <Text style={styles.employeeId}>Employee ID:<Text style={styles.employeeIdValue}>{user.employeeId}</Text></Text>
          )}
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Status */}
      <Text style={styles.statusText}>
        {isRunning ? '🟢  Session in progress' : '🔴  Not clocked in'}
      </Text>

      {/* Clock In / Out Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={() => handleAttendance('start')}
          disabled={isRunning || loading}
        >
          {loading && !isRunning
            ? <ActivityIndicator color='#fff' />
            : <Text style={styles.buttonText}>Clock In</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline, !isRunning && styles.buttonDisabled]}
          onPress={() => handleAttendance('end')}
          disabled={!isRunning || loading}
        >
          {loading && isRunning
            ? <ActivityIndicator color={Colors.primary} />
            : <Text style={[styles.buttonText, styles.buttonTextOutline]}>Clock Out</Text>
          }
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* History */}
      <Text style={styles.sectionHeading}>Attendance History</Text>

      {historyLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
      ) : history.length === 0 ? (
        <Text style={styles.emptyText}>No records yet. Clock in to get started.</Text>
      ) : (
        history.map((entry, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardDate}>{formatDate(entry.startTime)}</Text>
            <View style={styles.cardRow}>
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Clock In</Text>
                <Text style={styles.timeValue}>{formatTime(entry.startTime)}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Clock Out</Text>
                <Text style={styles.timeValue}>{formatTime(entry.endTime)}</Text>
              </View>
              <View style={styles.durationBlock}>
                <Text style={styles.durationLabel}>Duration</Text>
                <Text style={styles.durationValue}>{calcDuration(entry.startTime, entry.endTime)}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    gap: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: Colors.grey,
  },
  name: {
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: -1,
    color: '#111',
  },
  employeeId: {
    fontSize: 18,
    color: Colors.primary,
    marginTop: 2,
    letterSpacing: 1,
  },
  employeeIdValue: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  logout: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },

  // Status
  statusText: {
    fontSize: 15,
    color: Colors.grey,
  },

  // Buttons
  buttonRow: {
    gap: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 16,
  },
  buttonOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '400',
    fontSize: 18,
  },
  buttonTextOutline: {
    color: Colors.primary,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
  },

  // History
  sectionHeading: {
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: -0.5,
    color: '#111',
  },
  emptyText: {
    color: Colors.grey,
    fontSize: 15,
  },

  // Card
  card: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 4,
    padding: 14,
    gap: 10,
  },
  cardDate: {
    fontSize: 13,
    color: Colors.grey,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 11,
    color: Colors.grey,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 17,
    fontWeight: '400',
    color: '#111',
  },
  arrow: {
    fontSize: 16,
    color: '#d3d3d3',
  },
  durationBlock: {
    alignItems: 'flex-end',
  },
  durationLabel: {
    fontSize: 11,
    color: Colors.grey,
    marginBottom: 2,
  },
  durationValue: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.primary,
  },
});
