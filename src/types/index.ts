export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  organizer: string;
  thumbnailUrl: string;
  imageUrl: string;
  category?: string;
}

export interface InterestedEvent {
  eventId: string;
  markedAt: string;
}

export type AppTheme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  shadow: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface SearchFilters {
  query: string;
}

