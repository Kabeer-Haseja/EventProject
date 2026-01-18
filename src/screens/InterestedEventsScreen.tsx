import React, {useMemo, useCallback, useEffect} from 'react';
import {View, FlatList, StyleSheet, StatusBar} from 'react-native';
import {useTheme} from '../context';
import {EventCard, EmptyState} from '../components';
import {Event} from '../types';
import {useGetEventsQuery} from '../store/api/eventsApi';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {selectInterestedEventIds} from '../store/selectors';
import {loadInterestedEvents} from '../store/slices/interestedSlice';

interface InterestedEventsScreenProps {
  navigation: any;
}

export const InterestedEventsScreen: React.FC<
  InterestedEventsScreenProps
> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {colors, theme} = useTheme();

  // Get events from RTK Query cache
  const {data: events = []} = useGetEventsQuery();

  // Get interested event IDs from Redux
  const interestedEventIds = useAppSelector(selectInterestedEventIds);

  // Load interested events on mount
  useEffect(() => {
    dispatch(loadInterestedEvents());
  }, [dispatch]);

  const interestedEvents = useMemo(() => {
    return events.filter(event => interestedEventIds.includes(event.id));
  }, [events, interestedEventIds]);

  const handleEventPress = useCallback(
    (event: Event) => {
      navigation.navigate('EventDetail', {eventId: event.id});
    },
    [navigation],
  );

  const renderEvent = useCallback(
    ({item}: {item: Event}) => (
      <EventCard
        event={item}
        onPress={() => handleEventPress(item)}
        showInterestBadge={true}
      />
    ),
    [handleEventPress],
  );

  const renderEmpty = useCallback(
    () => (
      <EmptyState
        icon="⭐"
        title="No interested events"
        message="Browse events and mark the ones you're interested in!"
      />
    ),
    [],
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <FlatList
        data={interestedEvents}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          interestedEvents.length === 0 ? styles.emptyContainer : styles.content
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
  },
});

