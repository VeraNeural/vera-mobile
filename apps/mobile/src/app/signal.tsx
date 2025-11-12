import { View, Text, StyleSheet } from 'react-native';

export default function SignalComposer() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compose a Regulation Signal</Text>
      <Text style={styles.description}>
        Quick prompts adapt to your biometrics and current focus. Confirm to send nudges to Julija,
        Tarloy, or your clients.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Next best action</Text>
        <Text style={styles.cardValue}>Schedule 5-minute breathwork sync before marketing review.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
    paddingVertical: 48
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1f5f9'
  },
  description: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: '#e2e8f0'
  },
  card: {
    marginTop: 32,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#1e293b'
  },
  cardLabel: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1.2,
    color: '#38bdf8'
  },
  cardValue: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#e2e8f0'
  }
});
