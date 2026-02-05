import { FontText } from '@/global/ui';
import { Animated, Easing, Pressable, View } from 'react-native';
import { useEffect, useState } from 'react';
import TimePicker from '@/global/ui/TimePicker';
import { resTimeToTimeIndicatorFormat } from '../util/timeFormatChange';

interface SetNotiTimesBtnProps {
  isPushNotificationOn: boolean;
  savedStartTime: string;
  savedEndTime: string;
  setSavedStartTime: (time: string) => void;
  setSavedEndTime: (time: string) => void;
}

const SetNotiTimesBtn = ({
  isPushNotificationOn,
  savedStartTime,
  savedEndTime,
  setSavedStartTime,
  setSavedEndTime,
}: SetNotiTimesBtnProps) => {
  const [openedTimePicker, setOpenedTimePicker] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    if (!isPushNotificationOn) {
      setOpenedTimePicker(null);
    }
  }, [isPushNotificationOn]);

  // 타임피커 펼쳐지는 애니메이션
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    let toValue = 0;
    if (openedTimePicker === 'start') toValue = 1;
    else if (openedTimePicker === 'end') toValue = 2;

    const animation = Animated.timing(animatedValue, {
      toValue,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });

    animation.start();

    return () => animation.stop();
  }, [openedTimePicker]);

  const translateYStart = animatedValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [-10, 0, 53],
  });

  const translateYEnd = animatedValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [-10, -10, 0],
  });

  return (
    <>
      <View className="flex-row items-center justify-between px-16 h-53 border-b-1 border-gray-beb">
        <FontText text="시작 시간" />
        <Pressable
          className="items-center justify-center h-36 w-113 rounded-8 bg-gray-beb"
          onPress={() => setOpenedTimePicker(openedTimePicker === 'start' ? null : 'start')}
        >
          <FontText
            text={resTimeToTimeIndicatorFormat(savedStartTime)}
            className="text-light-blue"
          />
        </Pressable>
      </View>
      {openedTimePicker === 'start' && (
        <Animated.View style={{ transform: [{ translateY: translateYStart }] }}>
          <TimePicker setSelectedTime={setSavedStartTime} />
        </Animated.View>
      )}

      <View className="flex-row items-center justify-between px-16 h-53 border-b-1 border-gray-beb">
        <FontText text="종료 시간" />
        <Pressable
          className="items-center justify-center h-36 w-113 rounded-8 bg-gray-beb"
          onPress={() => setOpenedTimePicker(openedTimePicker === 'end' ? null : 'end')}
        >
          <FontText text={resTimeToTimeIndicatorFormat(savedEndTime)} className="text-light-blue" />
        </Pressable>
      </View>
      {openedTimePicker === 'end' && (
        <Animated.View style={{ transform: [{ translateY: translateYEnd }] }}>
          <TimePicker setSelectedTime={setSavedEndTime} />
        </Animated.View>
      )}
    </>
  );
};

export default SetNotiTimesBtn;
