import {createSelector} from '@reduxjs/toolkit';
import {RootState} from './index';
import {filterEvents} from '../services/eventService';

export const selectInterestedEventIds = (state: RootState) =>
  state.interested.eventIds;

export const selectSearchQuery = (state: RootState) => state.search.query;

export const selectFilteredEvents = createSelector(
  [
    (_state: RootState, events: any[] | undefined) => events || [],
    selectSearchQuery,
  ],
  (events, query) => filterEvents(events, query),
);

export const selectIsEventInterested = createSelector(
  [selectInterestedEventIds, (_state: RootState, eventId: string) => eventId],
  (interestedIds, eventId) => interestedIds.includes(eventId),
);

