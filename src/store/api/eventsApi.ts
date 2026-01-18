import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import {Event} from '../../types';
import eventsData from '../../data/events.json';

const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const SIMULATED_LATENCY = 500;

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Events'],
  endpoints: builder => ({
    getEvents: builder.query<Event[], void>({
      queryFn: async () => {
        try {
          await delay(SIMULATED_LATENCY);

          if (Math.random() < 0.05) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: 'Network request failed',
              },
            };
          }

          const events: Event[] = eventsData.map(event => ({
            ...event,
            date: new Date(event.date).toISOString(),
          }));

          const sorted = [...events].sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });

          return {data: sorted};
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch events',
            },
          };
        }
      },
      providesTags: ['Events'],
      keepUnusedDataFor: 900,
    }),

    getEventById: builder.query<Event | null, string>({
      queryFn: async eventId => {
        try {
          await delay(SIMULATED_LATENCY / 2);

          const event = eventsData.find(e => e.id === eventId);

          if (!event) {
            return {
              error: {
                status: 'NOT_FOUND',
                error: 'Event not found',
              },
            };
          }

          return {
            data: {
              ...event,
              date: new Date(event.date).toISOString(),
            },
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch event details',
            },
          };
        }
      },
      providesTags: (_result, _error, id) => [{type: 'Events', id}],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {useGetEventsQuery, useGetEventByIdQuery} = eventsApi;

