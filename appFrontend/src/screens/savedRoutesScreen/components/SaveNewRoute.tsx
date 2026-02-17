import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import React, { useEffect, useMemo, useState } from 'react';
import { useSavedSubwayRoute } from '@/global/apis/hooks';
import { useQueryClient } from 'react-query';
import { SubwaySimplePath } from '@/global/components';
import { Path, SubPath } from '@/global/apis/entity';
import { View, Keyboard, TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { IconInvalid } from '@/assets/icons';
import AddNewRouteHeader from './AddNewRouteHeader';
import { useRoute } from '@react-navigation/native';
import { showToast } from '@/global/utils/toast';
import cn from 'classname';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { trackMapBookmark4Name, trackMapBookmark5Finish } from '@/analytics/map.events';
import { SafeAreaView } from 'react-native-safe-area-context';

const SaveNewRoute = () => {
  const { state: resultData } = useRoute().params as { state: Path };
  const navigation = useRootNavigation();
  const queryClient = useQueryClient();

  const [roadName, setRoadName] = useState<string>('');
  const [isDuplicatedName, setIsDuplicatedName] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  const pathData = {
    station_departure: resultData.firstStartStation,
    station_arrival: resultData.lastEndStation,
    line_departure: resultData.subPaths[1].name,
    line_arrival: resultData.subPaths.at(-2)?.name!,
  };

  useEffect(() => {
    trackMapBookmark4Name(pathData);
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const freshSubPathData: SubPath[] = useMemo(() => {
    if (!resultData.subPaths) return [];
    const subPaths = resultData.subPaths;
    return Object.values(subPaths).filter((item) => !!item.stations.length);
  }, [resultData]);

  const { mutate, isLoading } = useSavedSubwayRoute({
    onSuccess: async (id) => {
      trackMapBookmark5Finish({ ...pathData, name: roadName });
      await queryClient.invalidateQueries('getRoads');
      navigation.navigate('MyPageNavigation', {
        screen: 'NotiSettingsDetailScreen',
        params: {
          myRoutes: { ...resultData, subPaths: freshSubPathData, id, roadName },
          prevScreen: 'SaveScreen',
        },
      });
      showToast('saveRoute');
    },
    onError: async ({ response }) => {
      setIsDuplicatedName(true);
      setErrorMessage(response.data.message);
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <AddNewRouteHeader />
        <View className="flex-1 px-16 bg-white">
          <View className="mt-32 mb-40 mx-33">
            <SubwaySimplePath
              pathData={freshSubPathData}
              arriveStationName={resultData.lastEndStation}
              betweenPathMargin={24}
              isHideIsuue
            />
          </View>
          <FontText text="새 경로 이름" className="text-14 leading-21" fontWeight="500" />
          <Input
            className="px-16 py-12 my-7 rounded-5 bg-gray-9f9"
            placeholder="경로 이름을 입력하세요"
            value={roadName}
            maxLength={10}
            onChangeText={(text) => {
              setRoadName(text);
              setIsDuplicatedName(false);
            }}
            inputMode="email"
            placeholderTextColor={COLOR.GRAY_999}
          />
          <View className="flex-row justify-between">
            {isDuplicatedName ? (
              <View className="flex-row items-center ml-9 h-14">
                <IconInvalid />
                <FontText
                  text={errorMessage}
                  className="ml-4 text-12 leading-14 text-light-red"
                  fontWeight="500"
                />
              </View>
            ) : (
              <View />
            )}
            <FontText
              text={`${roadName?.length ? roadName.length : 0}/10`}
              className="text-12 leading-14 text-gray-999"
            />
          </View>
        </View>
        <TouchableOpacity
          className={cn('items-center py-11', {
            'bg-gray-ddd': !roadName || isLoading || isDuplicatedName,
            'bg-black-717': roadName && !isLoading && !isDuplicatedName,
            'mx-16 mb-41 rounded-5': !isKeyboardVisible,
          })}
          onPress={() => {
            mutate({
              roadName: roadName,
              ...resultData,
              subPaths: freshSubPathData,
            });
          }}
          disabled={!roadName || isLoading || isDuplicatedName}
        >
          <FontText text="완료" className="text-white text-17" fontWeight="600" />
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SaveNewRoute;
