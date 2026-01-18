
import {Event, ApiResponse} from '../types';
import eventsData from '../data/events.json';
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const SIMULATED_LATENCY = 500;

export const fetchEvents = async (): Promise<ApiResponse<Event[]>> => {
  try {
    await delay(SIMULATED_LATENCY);

    if (Math.random() < 0.05) {
      throw new Error('Network request failed');
    }

    const events: Event[] = eventsData.map(event => ({
      ...event,
      date: new Date(event.date).toISOString(),
    }));

    return {
      data: events,
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch events. Please try again.',
    };
  }
};

export const filterEvents = (events: Event[], query: string): Event[] => {
  if (!query.trim()) {
    return events;
  }

  const lowerQuery = query.toLowerCase().trim();

  return events.filter(
    event =>
      event.name.toLowerCase().includes(lowerQuery) ||
      event.location.toLowerCase().includes(lowerQuery)
  );
};


export const sortEventsByDate = (events: Event[]): Event[] => {
  return [...events].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

