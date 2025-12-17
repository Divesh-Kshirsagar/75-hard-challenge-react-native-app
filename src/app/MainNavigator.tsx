import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TodayScreen } from './screens/TodayScreen';
import { PathScreen } from './screens/PathScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { JournalScreen } from './screens/JournalScreen';
import { PomodoroScreen } from './screens/PomodoroScreen';
import { CheckSquare, Map, User, BookOpen, Clock } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#111',
                    borderTopColor: '#333',
                    paddingBottom: 5,
                    height: 60
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#666',
            }}
        >
            <Tab.Screen 
                name="Today" 
                component={TodayScreen} 
                options={{
                    tabBarIcon: ({ color }) => <CheckSquare color={color} />
                }}
            />
            <Tab.Screen 
                name="Path" 
                component={PathScreen}
                options={{
                    tabBarIcon: ({ color }) => <Map color={color} />
                }}
            />
            <Tab.Screen 
                name="Journal" 
                component={JournalScreen}
                options={{
                    tabBarIcon: ({ color }) => <BookOpen color={color} />
                }}
            />
            <Tab.Screen 
                name="Focus" 
                component={PomodoroScreen}
                options={{
                    tabBarIcon: ({ color }) => <Clock color={color} />
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => <User color={color} />
                }}
            />
        </Tab.Navigator>
    );
};
