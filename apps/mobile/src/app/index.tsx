import { Link } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const integrations = ['Titan Mail', 'Make.com', 'Asana', 'TikTok', 'Instagram', 'Facebook'];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VERA Pocket Companion</Text>
      <Text style={styles.subtitle}>
        Real-time nervous system co-regulation that keeps you and your team synchronized between
        sessions.
      </Text>
      <View style={styles.list}>
        {integrations.map((item) => (
          <Text key={item} style={styles.listItem}>
            {item}
          </Text>
        ))}
      </View>
      <Link href="/signal" asChild>
        <Pressable style={styles.ctaButton}>
          <Text style={styles.ctaLabel}>Compose Regulation Signal</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020817',
    paddingHorizontal: 24,
    paddingVertical: 48
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#f8fafc'
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#cbd5f5'
  },
  list: {
    marginTop: 36
  },
  listItem: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: '#94a3b8',
    marginBottom: 8
  },
  ctaButton: {
    marginTop: 'auto',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  ctaLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  }
});
