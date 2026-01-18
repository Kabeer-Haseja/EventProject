# Event Explorer

React Native app for browsing and managing events. Built with TypeScript, Redux Toolkit Query, and React Navigation.

## Features

- Browse upcoming events with search
- View event details
- Mark events as interested
- Light/dark theme toggle
- Offline caching (15 min)

## Tech Stack

- React Native 0.83
- TypeScript
- Redux Toolkit Query (caching & state)
- React Navigation
- AsyncStorage

## Setup

```bash
# Install dependencies
yarn install

# iOS setup
cd ios && pod install && cd ..

# Run
yarn ios        # iOS
yarn android    # Android
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── screens/         # Screen components
├── navigation/      # Navigation config
├── store/          
│   ├── api/         # RTK Query API
│   ├── slices/      # Redux slices
│   ├── hooks.ts     # Typed hooks
│   └── selectors.ts # Memoized selectors
├── context/         # Theme context
├── storage/         # AsyncStorage utils
├── services/        # Business logic
├── data/            # Mock data
├── theme/           # Theme config
├── types/           # TypeScript types
└── utils/           # Helper functions
```

## State Management

### RTK Query (Server State)
- Auto caching (15 min)
- Auto refetching on focus/reconnect
- Request deduplication

### Redux Slices (Client State)
- Interested events (persisted to AsyncStorage)
- Search query

### Context (UI State)
- Theme (light/dark)

## Key Files

- `App.tsx` - Root component with providers
- `src/store/api/eventsApi.ts` - RTK Query API
- `src/store/slices/interestedSlice.ts` - Interested events state
- `src/screens/*_RTK.tsx` - Screen components
- `src/navigation/MainNavigator.tsx` - Navigation setup

## Technical Decisions

**RTK Query for Events:**
- Automatic caching eliminates manual cache management
- Smart refetching improves UX
- Built-in loading states reduce boilerplate
- DevTools support for debugging

**Redux for Client State:**
- Interested events need persistence
- Search query is global
- Predictable state updates

**Context for Theme:**
- Simple local state
- No need for Redux overhead

**AsyncStorage for Persistence:**
- Interested events persist across sessions
- Theme preference saved
- Event cache with timestamp

## Architecture

```
UI Components
    ↓
Redux Store (RTK Query + Slices)
    ↓
AsyncStorage (Persistence)
```

Unidirectional data flow with clear separation between server state (RTK Query), client state (Redux), and UI state (Context).

## Performance

- Memoized selectors prevent unnecessary calculations
- Request deduplication reduces network calls
- Selective re-renders (not full tree)
- FlatList for efficient list rendering
- Image optimization with resizeMode

## Time Spent

Approximately 8-10 hours including:
- Setup & architecture
- Redux/RTK Query implementation
- UI components & screens
- Testing
- Documentation

## Future Improvements

- Real API integration
- More comprehensive tests
- Animations
- Accessibility improvements
- i18n support
