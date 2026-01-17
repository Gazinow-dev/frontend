import { SubwaySimplePath } from '@/global/components';
import { FontText, Toggle } from '@/global/ui';
import { Pressable, TouchableOpacity, View } from 'react-native';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import cn from 'classname';
import SetNotiTimesBtn from './SetNotiTimesBtn';
import { useGetPathNotiQuery } from '../apis/hooks';
import { rawTimeToReqTimeFormat } from '../util/timeFormatChange';
import { showToast } from '@/global/utils/toast';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useMutation } from 'react-query';
import { disablePathNotiFetch, updatePathNotiSettingsFetch } from '../apis/func';
import { AxiosError } from 'axios';
import {
  DepArrNameAlert,
  trackMapBookmark6Setting,
  trackMapSearchBookmarkSetting,
} from '@/analytics/map.events';
import { RootStackParamList } from '@/navigation/types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotiSettingsDetailScreen = () => {
  const navigation = useRootNavigation();
  const params = useRoute().params as RootStackParamList['MyPageNavigation']['params'];
  if (!params) return;
  const { myRoutes, prevScreen } = params;

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

  const routeInfo = {
    station_departure: myRoutes.subPaths[0].stations[0].stationName,
    station_arrival: myRoutes.subPaths.at(-1)?.stations.at(-1)?.stationName!,
    line_departure: myRoutes.subPaths[0].name,
    line_arrival: myRoutes.subPaths.at(-1)?.name!,
    name: myRoutes.roadName,
  };

  const handleAfterSuccess = (trackData: DepArrNameAlert) => {
    if (prevScreen === 'SaveModal') {
      trackMapSearchBookmarkSetting(trackData);
      navigation.reset({ routes: [{ name: 'MainBottomTab' }] });
      return;
    }

    if (prevScreen === 'SaveScreen') {
      trackMapBookmark6Setting(trackData);
      navigation.reset({ routes: [{ name: 'MainBottomTab' }] });
      return;
    }

    navigation.goBack();
  };

  const handle400Error = (error: AxiosError) => {
    if (error.response?.status === 400) {
      showToast('saveNotiSettingsFailed');
    }
  };

  // 완료 버튼 클릭 시 요청 전송
  const { mutate: updatePathNotiSettingsMutate } = useMutation(updatePathNotiSettingsFetch, {
    onSuccess: (_, provider) => {
      const trackData = {
        ...routeInfo,
        alarm: 'on' as const,
        starttime: provider.dayTimeRanges[0].fromTime.replace(':', ''),
        finishtime: provider.dayTimeRanges[0].toTime.replace(':', ''),
        day: provider.dayTimeRanges.map(({ day }) => day).join(', '),
      };
      handleAfterSuccess(trackData);
    },
    onError: handle400Error,
  });
  const { mutate: disablePathNotiMutate } = useMutation(disablePathNotiFetch, {
    onSuccess: () => {
      const trackData = {
        ...routeInfo,
        alarm: 'off' as const,
      };
      handleAfterSuccess(trackData);
    },
    onError: handle400Error,
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
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="h-56 flex-row items-center justify-between px-16">
        <TouchableOpacity hitSlop={20} onPress={() => navigation.goBack()}>
          <IconChevronLeft />
        </TouchableOpacity>
        <FontText
          text={`${myRoutes.roadName} 알림설정`}
          className="text-18 leading-23"
          fontWeight="500"
        />
        <View className="w-24" />
      </View>

      <View className="mt-20 flex-1 bg-white">
        <View className="mx-50 mb-40">
          <SubwaySimplePath
            pathData={myRoutes.subPaths}
            arriveStationName={myRoutes.lastEndStation}
            betweenPathMargin={24}
            isHideIsuue
          />
        </View>

        <View className="h-53 flex-row items-center justify-between border-b-1 border-gray-beb px-16">
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

            <View className="border-b-1 border-gray-beb bg-white px-16 py-12">
              <FontText text="반복 요일" />
              <View className="flex-row justify-between pt-16">
                {days.map((day) => (
                  <Pressable
                    key={day}
                    className={cn('h-40 w-40 items-center justify-center rounded-full', {
                      'bg-purple-54f': selectedDays.includes(day),
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
        className={cn('mx-16 mb-41 h-48 items-center justify-center rounded-5 bg-black-717', {
          'bg-gray-ddd': isPushNotificationOn && selectedDays.length === 0,
        })}
        onPress={saveSettingsHandler}
        disabled={isPushNotificationOn && selectedDays.length === 0}
      >
        <FontText text="완료" className="text-17 text-white" fontWeight="600" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default NotiSettingsDetailScreen;
