import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Event} from '../types';
import {useTheme} from '../context';
import {formatEventDate, getRelativeTime} from '../utils';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  showInterestBadge?: boolean;
}

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  showInterestBadge = false,
}) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: colors.card}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Image
        source={{uri: event.thumbnailUrl}}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, {color: colors.text}]} numberOfLines={2}>
            {event.name}
          </Text>
          {showInterestBadge && (
            <View style={[styles.badge, {backgroundColor: colors.primary}]}>
              <Text style={styles.badgeText}>★</Text>
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.date, {color: colors.textSecondary}]}>
            📅 {formatEventDate(event.date)}
          </Text>
          <Text style={[styles.relativeTime, {color: colors.primary}]}>
            {getRelativeTime(event.date)}
          </Text>
        </View>

        <Text style={[styles.location, {color: colors.textSecondary}]}>
          📍 {event.location}
        </Text>

        {event.category && (
          <View
            style={[
              styles.categoryBadge,
              {backgroundColor: colors.background},
            ]}>
            <Text style={[styles.categoryText, {color: colors.primary}]}>
              {event.category}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    flex: 1,
  },
  relativeTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  location: {
    fontSize: 14,
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

