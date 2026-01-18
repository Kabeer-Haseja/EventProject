import React, {useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useTheme} from '../context';
import {LoadingSpinner, ErrorView, Button} from '../components';
import {formatEventDateTime, getRelativeTime} from '../utils';
import {useGetEventsQuery} from '../store/api/eventsApi';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {selectIsEventInterested} from '../store/selectors';
import {
  addInterestedEvent,
  removeInterestedEvent,
} from '../store/slices/interestedSlice';

interface EventDetailScreenProps {
  route: any;
  navigation: any;
}

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
  colors: any;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  subtitle,
  colors,
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoContent}>
      <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, {color: colors.text}]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.infoSubtitle, {color: colors.primary}]}>
          {subtitle}
        </Text>
      )}
    </View>
  </View>
);

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {eventId} = route.params;
  const dispatch = useAppDispatch();
  const {colors, theme} = useTheme();

  // Get all events (from cache if available)
  const {data: events = [], isLoading} = useGetEventsQuery();
  const event = events.find(e => e.id === eventId);

  // Check if event is interested
  const isInterested = useAppSelector(state =>
    selectIsEventInterested(state, eventId),
  );

  const [toggling, setToggling] = React.useState(false);

  const handleToggleInterested = useCallback(async () => {
    if (!event) return;

    setToggling(true);
    try {
      if (isInterested) {
        await dispatch(removeInterestedEvent(eventId)).unwrap();
      } else {
        await dispatch(addInterestedEvent(eventId)).unwrap();
      }
    } catch (error) {
      console.error('Error toggling interested:', error);
    } finally {
      setToggling(false);
    }
  }, [event, eventId, isInterested, dispatch]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.text,
      headerShadowVisible: false,
    });
  }, [navigation, colors]);

  if (isLoading) {
    return (
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <LoadingSpinner message="Loading event details..." />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <ErrorView
          message="Event not found"
          onRetry={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <Image
          source={{uri: event.imageUrl}}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, {color: colors.text}]}>
              {event.name}
            </Text>
            {isInterested && (
              <View
                style={[
                  styles.interestedBadge,
                  {backgroundColor: colors.success},
                ]}>
                <Text style={styles.badgeText}>★ Interested</Text>
              </View>
            )}
          </View>

          {event.category && (
            <View
              style={[styles.categoryBadge, {backgroundColor: colors.card}]}>
              <Text style={[styles.categoryText, {color: colors.primary}]}>
                {event.category}
              </Text>
            </View>
          )}

          <View style={styles.infoSection}>
            <InfoRow
              icon="📅"
              label="Date & Time"
              value={formatEventDateTime(event.date)}
              subtitle={getRelativeTime(event.date)}
              colors={colors}
            />
            <InfoRow
              icon="📍"
              label="Location"
              value={event.location}
              colors={colors}
            />
            <InfoRow
              icon="👤"
              label="Organizer"
              value={event.organizer}
              colors={colors}
            />
          </View>

          <View style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>
              About this event
            </Text>
            <Text style={[styles.description, {color: colors.textSecondary}]}>
              {event.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {backgroundColor: colors.background, borderTopColor: colors.border},
        ]}>
        <Button
          title={isInterested ? 'Remove from Interested' : 'Mark as Interested'}
          onPress={handleToggleInterested}
          variant={isInterested ? 'outline' : 'primary'}
          loading={toggling}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  interestedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 32,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  descriptionSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  button: {
    width: '100%',
  },
});

