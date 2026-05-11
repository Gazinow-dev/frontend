import { AxiosError } from 'axios';
import cn from 'classname';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from 'react-query';
import React, { useEffect, useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/core';
import type { StationDataTypes } from '@/store/modules';
import { showToast } from '@/global/utils/toast';
import { FontText, Toggle } from '@/global/ui';
import { useOnboardingNavigation } from '@/navigation/OnboardingNavigation';
import { OnboardingStackParamList } from '@/navigation/types/navigation';
import { DepArrNameAlert, trackMapSearchBookmarkSetting } from '@/analytics/map.events';
import {
  disablePathNotiFetch,
  enablePathNotiSettingsFetch,
  updatePathNotiSettingsFetch,
} from '@/screens/myRootScreen/apis/func';
import { useGetPathNotiQuery } from '@/screens/myRootScreen/apis/hooks';
import SetNotiTimesBtn from '@/screens/myRootScreen/components/SetNotiTimesBtn';
import { rawTimeToReqTimeFormat } from '@/screens/myRootScreen/util/timeFormatChange';
import { OnboardingHeader } from './components';

export interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}

const OnboardingSetAlertScreen = () => {
  const onboardingNavigation = useOnboardingNavigation();
  const { newPath } = useRoute().params as {
    newPath: OnboardingStackParamList['OnboardingWalkTime']['newPath'];
  };
  if (!newPath || !newPath.id) return null;

  const { pathNotiData } = useGetPathNotiQuery(newPath.id);
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
    station_departure: newPath.transitStationList[0].stationsName,
    station_arrival: newPath.transitStationList.at(-1)?.stationsName!,
    line_departure: newPath.transitStationList[0].line,
    line_arrival: newPath.transitStationList.at(-1)?.line!,
    name: '출근길',
  };

  const buildOnTrackData = (provider: {
    dayTimeRanges: { day: string; fromTime: string; toTime: string }[];
  }): DepArrNameAlert => ({
    ...routeInfo,
    alarm: 'on' as const,
    starttime: provider.dayTimeRanges[0].fromTime.replace(':', ''),
    finishtime: provider.dayTimeRanges[0].toTime.replace(':', ''),
    day: provider.dayTimeRanges.map(({ day }) => day).join(', '),
  });

  const handleAfterSuccess = (trackData: DepArrNameAlert) => {
    showToast('saveNotiSettingsSuccess');

    trackMapSearchBookmarkSetting(trackData);

    onboardingNavigation.push('OnboardingPathName', { newPath });
  };

  const mutationOptions = {
    onSuccess: (_: unknown, provider: any) => {
      handleAfterSuccess(buildOnTrackData(provider));
    },
    onError: (error: AxiosError) => {
      showToast(
        error.response?.status === 400 ? 'notiSettingsTimeError' : 'saveNotiSettingsFailed',
      );
    },
  };

  // 완료 버튼 클릭 시 요청 전송
  const { mutate: enablePathNotiSettingsMutate } = useMutation(
    enablePathNotiSettingsFetch,
    mutationOptions,
  );
  const { mutate: updatePathNotiSettingsMutate } = useMutation(
    updatePathNotiSettingsFetch,
    mutationOptions,
  );

  const { mutate: disablePathNotiMutate } = useMutation(disablePathNotiFetch, {
    onSuccess: () => handleAfterSuccess({ ...routeInfo, alarm: 'off' as const }),
    onError: () => showToast('saveNotiSettingsFailed'),
  });

  const createNotiSettingsBody = (selectedDays: string[], newPathId: number) => {
    return {
      myPathId: newPathId,
      dayTimeRanges: selectedDays.map((day) => ({
        day,
        fromTime: rawTimeToReqTimeFormat(savedStartTime),
        toTime: rawTimeToReqTimeFormat(savedEndTime),
      })),
    };
  };

  const saveSettingsHandler = () => {
    if (!newPath.id) return;

    const notiSettings = createNotiSettingsBody(selectedDays, newPath.id);
    if (!isPushNotificationOn) {
      disablePathNotiMutate(newPath.id);
    } else if (pathNotiData?.enabled) {
      updatePathNotiSettingsMutate(notiSettings);
    } else {
      enablePathNotiSettingsMutate(notiSettings);
    }
  };

  return (
    <SafeAreaView className="flex-1 px-16 bg-gray-9f9">
      <OnboardingHeader />
      <View className="pt-16 pb-14">
        <View className="relative">
          <View className="h-6 w-full rounded-3 bg-[#78787833]" />
          <View className={`absolute z-10 h-6 w-3/4 rounded-3 bg-black-717`} />
        </View>
      </View>

      <View className="h-28" />

      <View className="space-y-10">
        <FontText text="언제 알림을 받을까요?" fontWeight="700" className="text-24 leading-32" />
        <FontText
          text="이 시간대에만 알림을 보내드려요"
          className="text-13 leading-19 text-gray-999"
        />
      </View>

      <View className="h-28" />

      <View className="flex-1">
        <View className="py-8 bg-white rounded-14">
          <View className="flex-row items-center justify-between px-16 h-53 border-b-1 border-gray-beb">
            <FontText text="푸시 알림 받기" />
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

              <View className="px-16 py-21">
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
      </View>

      <TouchableOpacity
        className={cn('mb-56 items-center justify-center rounded-5 bg-black-717 p-11', {
          'bg-gray-ddd': isPushNotificationOn && selectedDays.length === 0,
        })}
        onPress={saveSettingsHandler}
        disabled={isPushNotificationOn && selectedDays.length === 0}
      >
        <FontText
          text="다음"
          className="text-center text-white text-17 leading-26"
          fontWeight="600"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingSetAlertScreen;
