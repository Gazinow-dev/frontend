import { FontText } from '@/global/ui';
import { Animated, Easing, Pressable, View } from 'react-native';
import { useEffect, useState } from 'react';
import TimePicker from '@/global/ui/TimePicker';
import { COLOR } from '@/global/constants';
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
      <View className="flex-row h-53 px-16 items-center justify-between border-b-1 border-gray-eb">
        <FontText
          value="시작 시간"
          textSize="16px"
          textWeight="Regular"
          textColor={!isPushNotificationOn ? COLOR.GRAY_BE : COLOR.BASIC_BLACK}
        />
        <Pressable
          className="w-113 h-36 rounded-8 bg-gray-eb items-center justify-center"
          onPress={() => setOpenedTimePicker(openedTimePicker === 'start' ? null : 'start')}
          disabled={!isPushNotificationOn}
        >
          <FontText
            value={resTimeToTimeIndicatorFormat(savedStartTime)}
            textColor={!isPushNotificationOn ? COLOR.GRAY_BE : '#346BF7'}
            textSize="16px"
            textWeight="Regular"
          />
        </Pressable>
      </View>
      {isPushNotificationOn && openedTimePicker === 'start' && (
        <Animated.View style={{ transform: [{ translateY: translateYStart }] }}>
          <TimePicker setSelectedTime={setSavedStartTime} />
        </Animated.View>
      )}

      <View className="flex-row h-53 px-16 items-center justify-between border-b-1 border-gray-eb">
        <FontText
          value="종료 시간"
          textSize="16px"
          textWeight="Regular"
          textColor={!isPushNotificationOn ? COLOR.GRAY_BE : COLOR.BASIC_BLACK}
        />
        <Pressable
          className="w-113 h-36 rounded-8 bg-gray-eb items-center justify-center"
          onPress={() => setOpenedTimePicker(openedTimePicker === 'end' ? null : 'end')}
          disabled={!isPushNotificationOn}
        >
          <FontText
            value={resTimeToTimeIndicatorFormat(savedEndTime)}
            textColor={!isPushNotificationOn ? COLOR.GRAY_BE : '#346BF7'}
            textSize="16px"
            textWeight="Regular"
          />
        </Pressable>
      </View>
      {isPushNotificationOn && openedTimePicker === 'end' && (
        <Animated.View style={{ transform: [{ translateY: translateYEnd }] }}>
          <TimePicker setSelectedTime={setSavedEndTime} />
        </Animated.View>
      )}
    </>
  );
};

export default SetNotiTimesBtn;
