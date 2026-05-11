import toastConfig from '@global/utils/ToastConfig';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import {
  OnboardingCompletedScreen,
  OnboardingPathNameScreen,
  OnboardingScreen,
  OnboardingSetAlertScreen,
  OnboardingSwapScreen,
  OnboardingWalkTimeScreen,
} from '@/screens/onboardingScreen';
import { OnboardingStackParamList } from './types/navigation';

const Stack = createStackNavigator<OnboardingStackParamList>();

const screenOption = {
  headerShown: false,
};

const OnboardingNavigation = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={screenOption}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="OnboardingSwap" component={OnboardingSwapScreen} />
        <Stack.Screen name="OnboardingWalkTime" component={OnboardingWalkTimeScreen} />
        <Stack.Screen name="OnboardingSetAlert" component={OnboardingSetAlertScreen} />
        <Stack.Screen name="OnboardingPathName" component={OnboardingPathNameScreen} />
        <Stack.Screen name="OnboardingCompleted" component={OnboardingCompletedScreen} />
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </>
  );
};

export default OnboardingNavigation;

export const useOnboardingNavigation = <RouteName extends keyof OnboardingStackParamList>() => {
  return useNavigation<StackNavigationProp<OnboardingStackParamList, RouteName>>();
};
