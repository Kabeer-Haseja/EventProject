import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {useTheme} from '../context';
import {
  EventCard,
  SearchBar,
  LoadingSpinner,
  ErrorView,
  EmptyState,
} from '../components';
import {Event} from '../types';
import {useGetEventsQuery} from '../store/api/eventsApi';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {
  selectSearchQuery,
  selectFilteredEvents,
  selectInterestedEventIds,
} from '../store/selectors';
import {setSearchQuery} from '../store/slices/searchSlice';
import {loadInterestedEvents} from '../store/slices/interestedSlice';
import {useDebounce} from '../hooks';

interface EventListScreenProps {
  navigation: any;
}

export const EventListScreen: React.FC<EventListScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const {colors, theme} = useTheme();

  const {
    data: events = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetEventsQuery();

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  const searchQuery = useAppSelector(selectSearchQuery);
  const filteredEvents = useAppSelector(state =>
    selectFilteredEvents(state, events),
  );
  const interestedEventIds = useAppSelector(selectInterestedEventIds);

  useEffect(() => {
    dispatch(loadInterestedEvents());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery));
  }, [debouncedSearchQuery, dispatch]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEventPress = useCallback(
    (event: Event) => {
      navigation.navigate('EventDetail', {eventId: event.id});
    },
    [navigation],
  );

  const handleSearchChange = useCallback((text: string) => {
    setLocalSearchQuery(text);
  }, []);

  const renderEvent = useCallback(
    ({item}: {item: Event}) => (
      <EventCard
        event={item}
        onPress={() => handleEventPress(item)}
        showInterestBadge={interestedEventIds.includes(item.id)}
      />
    ),
    [handleEventPress, interestedEventIds],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading && filteredEvents.length === 0) {
      return null;
    }

    if (searchQuery) {
      return (
        <EmptyState
          icon="🔍"
          title="No events found"
          message={`No events match "${searchQuery}"`}
        />
      );
    }

    return (
      <EmptyState
        icon="📅"
        title="No events available"
        message="Check back later for upcoming events"
      />
    );
  }, [isLoading, filteredEvents.length, searchQuery]);

  // Initial loading state
  if (isLoading && !events.length) {
    return (
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <LoadingSpinner message="Loading events..." />
      </View>
    );
  }

  if (error && !events.length) {
    const errorMessage =
      'error' in error
        ? String(error.error)
        : 'Failed to load events. Please try again.';

    return (
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <ErrorView message={errorMessage} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <SearchBar
            value={localSearchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search by name or location..."
          />
        }
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={
          filteredEvents.length === 0 ? styles.emptyContainer : styles.content
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

