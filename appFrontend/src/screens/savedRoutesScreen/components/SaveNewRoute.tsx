import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import React, { useEffect, useMemo, useState } from 'react';
import { useSavedSubwayRoute } from '@/global/apis/hooks';
import { useQueryClient } from 'react-query';
import { SubwaySimplePath } from '@/global/components';
import { Path, SubPath } from '@/global/apis/entity';
import { View, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import XCircle from '@assets/icons/x-circle-standard.svg';
import AddNewRouteHeader from './AddNewRouteHeader';
import { useRoute } from '@react-navigation/native';
import { showToast } from '@/global/utils/toast';
import cn from 'classname';
import { useRootNavigation } from '@/navigation/RootNavigation';

const SaveNewRoute = () => {
  const { state: resultData } = useRoute().params as { state: Path };
  const navigation = useRootNavigation();
  const queryClient = useQueryClient();

  const [roadName, setRoadName] = useState<string>('');
  const [isDuplicatedName, setIsDuplicatedName] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
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
    const subPaths = resultData?.subPaths || [];
    return subPaths.filter((subPath) => !!subPath.stations.length);
  }, [resultData]);

  const { mutate, isLoading } = useSavedSubwayRoute({
    onSuccess: async (id) => {
      await queryClient.invalidateQueries('getRoads');
      navigation.navigate('MyPageNavigation', {
        screen: 'NotiSettingsDetailScreen',
        params: { myRoutes: { ...resultData, id, roadName }, isRightAfterAddingNewPath: true },
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
      <SafeAreaView className="flex-1 bg-white">
        <AddNewRouteHeader />
        <View className="flex-1 px-16 bg-white">
          <View className="mt-32 mx-33 mb-22">
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
            onChangeText={(text) => {
              if (text.length > 10) return;
              setRoadName(text);
              setIsDuplicatedName(false);
            }}
            inputMode="email"
            placeholderTextColor={COLOR.GRAY_999}
          />
          <View className="flex-row justify-between">
            {isDuplicatedName ? (
              <View className="flex-row items-center h-14 ml-9">
                <XCircle width={14} />
                <FontText
                  text={errorMessage}
                  className="ml-4 text-12 text-light-red leading-14"
                  fontWeight="500"
                />
              </View>
            ) : (
              <View />
            )}
            <FontText
              text={`${roadName?.length ? roadName.length : 0}/10`}
              className="text-12 text-gray-999 leading-14"
            />
          </View>
        </View>
        <TouchableOpacity
          className={cn('py-11 items-center', {
            'bg-gray-ddd': !roadName || isLoading || isDuplicatedName,
            'bg-black-717': roadName && !isLoading && !isDuplicatedName,
            'mb-41 mx-16 rounded-5': !isKeyboardVisible,
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
