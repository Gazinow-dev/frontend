import { SubwaySimplePath } from '@/global/components';
import { FontText, Toggle } from '@/global/ui';
import { Pressable, SafeAreaView, TouchableOpacity, View } from 'react-native';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import { useRoute } from '@react-navigation/native';
import { MyRoutesType } from '@/global/apis/entity';
import { useEffect, useState } from 'react';
import cn from 'classname';
import SetNotiTimesBtn from './SetNotiTimesBtn';
import {
  useAddPathNotiSettingsMutation,
  useDisablePathNotiMutation,
  useGetPathNotiQuery,
  usePathUpdateNotiSettingsMutation,
} from '../apis/hooks';
import { rawTimeToReqTimeFormat } from '../util/timeFormatChange';
import { showToast } from '@/global/utils/toast';
import { useRootNavigation } from '@/navigation/RootNavigation';

const NotiSettingsDetailScreen = () => {
  const navigation = useRootNavigation();
  const { myRoutes, isRightAfterAddingNewPath } = useRoute().params as {
    myRoutes: MyRoutesType;
    isRightAfterAddingNewPath?: boolean;
  };

  const { pathNotiData } = useGetPathNotiQuery(myRoutes.id);
  const [isPushNotificationOn, setIsPushNotificationOn] = useState<boolean>(false);
  const [savedStartTime, setSavedStartTime] = useState<string>('07:00');
  const [savedEndTime, setSavedEndTime] = useState<string>('09:00');

  // 저장된 설정 불러오기
  useEffect(() => {
    if (pathNotiData?.enabled) {
      setIsPushNotificationOn(true);
      setSelectedDays(pathNotiData.notificationTimes.map((notiTimes) => notiTimes.dayOfWeek));
      setSavedStartTime(pathNotiData?.notificationTimes[0].fromTime);
      setSavedEndTime(pathNotiData?.notificationTimes[0].toTime);
    } else {
      setIsPushNotificationOn(false);
      setSavedStartTime('07:00');
      setSavedEndTime('09:00');
      setSelectedDays([]);
    }
  }, [pathNotiData]);

  // 푸시 알림 on 토글
  const handlePushNotificationOnToggle = () => {
    setIsPushNotificationOn(!isPushNotificationOn);
    setSelectedDays([]);
  };

  // 알림 받을 요일 선택
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const toggleDay = (day: string) => {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(day)) {
        return prevSelectedDays.filter((selectedDay) => selectedDay !== day);
      } else {
        return [...prevSelectedDays, day];
      }
    });
  };

  // 완료 버튼 클릭 시 요청 전송
  const { addPathNotiSettingsMutate } = useAddPathNotiSettingsMutation({
    onSuccess: async () => navigation.goBack(),
    onError: async (error) => {
      if (error.response?.status == 400) {
        showToast('saveNotiSettingsFailed');
      }
    },
  });
  const { updatePathNotiSettingsMutate } = usePathUpdateNotiSettingsMutation({
    onSuccess: async () => {
      if (isRightAfterAddingNewPath) {
        navigation.reset({ routes: [{ name: 'MainBottomTab' }] });
      } else {
        navigation.goBack();
      }
    },
    onError: async (error) => {
      if (error.response?.status == 400) {
        showToast('saveNotiSettingsFailed');
      }
    },
  });
  const { disablePathNotiMutate } = useDisablePathNotiMutation({
    onSuccess: async () => navigation.goBack(),
  });

  const createNotiSettingsBody = (selectedDays: string[], myRoutesId: number) => {
    return {
      myPathId: myRoutesId,
      dayTimeRanges: selectedDays.map((day) => ({
        day,
        fromTime: rawTimeToReqTimeFormat(savedStartTime),
        toTime: rawTimeToReqTimeFormat(savedEndTime),
      })),
    };
  };

  const saveSettingsHandler = () => {
    const notiSettings = createNotiSettingsBody(selectedDays, myRoutes.id);
    if (!isPushNotificationOn) {
      disablePathNotiMutate(myRoutes.id);
    } else if (pathNotiData?.enabled) {
      updatePathNotiSettingsMutate(notiSettings);
    } else {
      addPathNotiSettingsMutate(notiSettings);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between h-56 px-16">
        <TouchableOpacity hitSlop={20} onPress={() => navigation.goBack()}>
          <IconLeftArrowHead color="#3F3F46" width={24} />
        </TouchableOpacity>
        <FontText
          text={`${myRoutes.roadName} 알림설정`}
          className="text-18 leading-23"
          fontWeight="500"
        />
        <View className="w-24" />
      </View>

      <View className="flex-1 mt-20 bg-white">
        <View className="mb-40 mx-50">
          <SubwaySimplePath
            pathData={myRoutes.subPaths}
            arriveStationName={myRoutes.lastEndStation}
            betweenPathMargin={24}
            isHideIsuue
          />
        </View>

        <View className="flex-row items-center justify-between px-16 h-53 border-b-1 border-gray-beb">
          <FontText text="푸시 알림 on" />
          <Toggle isOn={isPushNotificationOn} onToggle={handlePushNotificationOnToggle} />
        </View>
        {isPushNotificationOn && (
          <>
            <SetNotiTimesBtn
              isPushNotificationOn
              savedStartTime={savedStartTime}
              setSavedStartTime={setSavedStartTime}
              savedEndTime={savedEndTime}
              setSavedEndTime={setSavedEndTime}
            />

            <View className="px-16 py-12 bg-white border-b-1 border-gray-beb">
              <FontText text="반복 요일" />
              <View className="flex-row justify-between pt-16">
                {days.map((day) => (
                  <Pressable
                    key={day}
                    className={cn('w-40 h-40 rounded-full items-center justify-center', {
                      'bg-[#49454F]': selectedDays.includes(day),
                      'bg-gray-f2': !selectedDays.includes(day),
                    })}
                    onPress={() => toggleDay(day)}
                    hitSlop={10}
                  >
                    <FontText
                      text={day}
                      className={cn({
                        'text-white': selectedDays.includes(day),
                        'text-gray-999': !selectedDays.includes(day),
                      })}
                      fontWeight="500"
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity
        className={cn('h-48 mx-16 mb-41 rounded-5 items-center justify-center bg-black-717', {
          'bg-gray-ddd': isPushNotificationOn && selectedDays.length === 0,
        })}
        onPress={saveSettingsHandler}
        disabled={isPushNotificationOn && selectedDays.length === 0}
      >
        <FontText text="완료" className="text-white text-17" fontWeight="600" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default NotiSettingsDetailScreen;
