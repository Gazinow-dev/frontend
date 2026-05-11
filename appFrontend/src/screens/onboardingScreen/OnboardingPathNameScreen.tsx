import cn from 'classname';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from 'react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { StationDataTypes } from '@/store/modules';
import { SubPath } from '@/global/apis/entity';
import { useSavedSubwayRoute } from '@/global/apis/hooks';
import { showToast } from '@/global/utils/toast';
import { SubwaySimplePath } from '@/global/components';
import LoadingCircle from '@/global/components/animations/LoadingCircle';
import { COLOR } from '@/global/constants';
import { FontText, Input } from '@/global/ui';
import { useOnboardingNavigation } from '@/navigation/OnboardingNavigation';
import { OnboardingStackParamList } from '@/navigation/types/navigation';
import { trackMapBookmark4Name, trackMapBookmark5Finish } from '@/analytics/map.events';
import { OnboardingHeader } from './components';

export interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}

const OnboardingPathNameScreen = () => {
  const onboardingNavigation = useOnboardingNavigation();
  const { newPath } = useRoute().params as {
    newPath: OnboardingStackParamList['OnboardingPathName']['newPath'];
  };
  if (!newPath || !newPath.id) return null;

  const [pathName, setPathName] = useState('출근길');
  const recommendedNames = ['출근길', '퇴근길', '학교가는 길', '집 가는 길'];

  const queryClient = useQueryClient();

  const pathData = {
    station_departure: newPath.transitStationList[0].stationsName,
    station_arrival: newPath.transitStationList.at(-1)?.stationsName!,
    line_departure: newPath.transitStationList[0].line,
    line_arrival: newPath.transitStationList.at(-1)?.line!,
  };

  useEffect(() => {
    trackMapBookmark4Name(pathData);
  }, []);

  const freshSubPathData: SubPath[] = useMemo(() => {
    if (!newPath.subPaths) return [];
    const subPaths = newPath.subPaths;
    return Object.values(subPaths).filter((item) => !!item.stations.length);
  }, [newPath]);

  const { mutate, isLoading } = useSavedSubwayRoute({
    onSuccess: async () => {
      trackMapBookmark5Finish({ ...pathData, name: pathName });
      onboardingNavigation.push('OnboardingCompleted', { pathName });
      showToast('saveRoute');
      queryClient.invalidateQueries('getRoads');
    },
    onError: () => {},
  });

  const handleSave = () => {
    mutate({
      ...newPath,
      subPaths: freshSubPathData,
      roadName: pathName,
    });
  };

  return (
    <SafeAreaView className="flex-1 px-16 bg-gray-9f9">
      {isLoading && (
        <View className="absolute items-center justify-center w-full h-full">
          <LoadingCircle />
        </View>
      )}

      <OnboardingHeader />

      <View className="flex-1 space-y-28">
        <View className="pt-16 pb-14">
          <View className="relative">
            <View className="h-6 w-full rounded-3 bg-[#78787833]" />
            <View className="absolute z-10 w-full h-6 rounded-3 bg-black-717" />
          </View>
        </View>

        <View className="space-y-10">
          <FontText
            text="이 경로의 이름을 정해주세요"
            fontWeight="700"
            className="text-24 leading-32"
          />
          <FontText
            text="나중에 언제든 변경할 수 있어요"
            className="text-13 leading-19 text-gray-999"
          />
        </View>

        <View className="space-y-16">
          {/* 경로 컴포넌트 */}
          <View className="p-16 bg-white rounded-14">
            <SubwaySimplePath
              pathData={newPath.subPaths}
              arriveStationName={newPath.lastEndStation}
              betweenPathMargin={16}
            />
          </View>

          {/* 새 경로 이름 입력 컴포넌트 */}
          <View className="p-16 bg-white space-y-7 rounded-14">
            <FontText text="새 경로 이름" className="text-14 leading-21" fontWeight="500" />
            <Input
              className="px-16 py-12 rounded-5 bg-gray-9f9"
              value={pathName}
              onChangeText={(text) => setPathName(text)}
              inputMode="text"
              placeholder="경로 이름을 입력하세요"
              placeholderTextColor={COLOR.GRAY_999}
              maxLength={10}
            />
            <FontText
              text={`${pathName.length}/10`}
              className="text-right text-12 leading-14 text-gray-ebe"
            />
          </View>
        </View>

        {/* 추천 경로 이름 컴포넌트 */}
        <View className="space-y-8">
          <FontText text="추천 경로 이름" className="text-13 leading-19 text-gray-999" />
          <View className="flex-row items-center space-x-12">
            {recommendedNames.map((name) => (
              <TouchableOpacity
                key={name}
                className={cn('rounded-17 bg-[#f5f5f5] px-8 py-7', {
                  'bg-black-717': name === pathName,
                })}
                onPress={() => setPathName(name)}
              >
                <FontText
                  text={name}
                  className={cn('text-gray-999', { 'text-gray-9f9': name === pathName })}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity className="mb-56 rounded-5 bg-black-717 p-11" onPress={handleSave}>
        <FontText
          text="경로 저장하기"
          className="text-center text-white text-17 leading-26"
          fontWeight="600"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingPathNameScreen;
