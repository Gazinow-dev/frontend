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

    Animated.timing(animatedValue, {
      toValue,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
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
      <View className="flex-row h-53 px-16 items-center justify-between border-b-1 border-gray-beb">
        <FontText value="시작 시간" textSize="16px" textWeight="Regular" />
        <Pressable
          className="w-113 h-36 rounded-8 bg-gray-beb items-center justify-center"
          onPress={() => setOpenedTimePicker(openedTimePicker === 'start' ? null : 'start')}
        >
          <FontText
            value={resTimeToTimeIndicatorFormat(savedStartTime)}
            textColor="#346BF7"
            textSize="16px"
            textWeight="Regular"
          />
        </Pressable>
      </View>
      {openedTimePicker === 'start' && (
        <Animated.View style={{ transform: [{ translateY: translateYStart }] }}>
          <TimePicker setSelectedTime={setSavedStartTime} />
        </Animated.View>
      )}

      <View className="flex-row h-53 px-16 items-center justify-between border-b-1 border-gray-beb">
        <FontText value="종료 시간" textSize="16px" textWeight="Regular" />
        <Pressable
          className="w-113 h-36 rounded-8 bg-gray-beb items-center justify-center"
          onPress={() => setOpenedTimePicker(openedTimePicker === 'end' ? null : 'end')}
        >
          <FontText
            value={resTimeToTimeIndicatorFormat(savedEndTime)}
            textColor="#346BF7"
            textSize="16px"
            textWeight="Regular"
          />
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
