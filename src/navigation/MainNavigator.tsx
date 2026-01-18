import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '../context';
import {EventDetailScreen, EventListScreen, InterestedEventsScreen,} from '../screens';

export type RootStackParamList = {
    MainTabs: undefined;
    EventDetail: { eventId: string };
};

export type MainTabParamList = {
    Events: undefined;
    Interested: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();


const MainTabs: React.FC = () => {
    const {colors, theme, toggleTheme} = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                },
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
                headerShadowVisible: false,
            }}>
            <Tab.Screen
                name="Events"
                component={EventListScreen}
                options={{
                    title: 'All Events',
                    tabBarLabel: 'Events',
                    tabBarIcon: ({color}) => (
                        <Text style={{fontSize: 24, color}}>📅</Text>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={toggleTheme}
                            style={{marginRight: 16, padding: 8}}>
                            <Text style={{fontSize: 24}}>
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tab.Screen
                name="Interested"
                component={InterestedEventsScreen}
                options={{
                    title: 'My Interested Events',
                    tabBarLabel: 'Interested',
                    tabBarIcon: ({color}) => (
                        <Text style={{fontSize: 24, color}}>⭐</Text>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={toggleTheme}
                            style={{marginRight: 16, padding: 8}}>
                            <Text style={{fontSize: 24}}>
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </Text>
                        </TouchableOpacity>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

/**
 * Root Stack Navigator
 * Wraps the tab navigator and adds detail screens
 */
export const MainNavigator: React.FC = () => {
    const {colors} = useTheme();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.text,
                    headerShadowVisible: false,
                    cardStyle: {
                        backgroundColor: colors.background,
                    },
                }}>
                <Stack.Screen
                    name="MainTabs"
                    component={MainTabs}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="EventDetail"
                    component={EventDetailScreen}
                    options={{
                        title: 'Event Details',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

