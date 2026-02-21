import { FontText, Toggle } from '@/global/ui';
import cn from 'classname';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { useGetSavedRoutesQuery } from '@/global/apis/hooks';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  getDetailPushNotiOnStatusFetch,
  getPushNotiOnStatusFetch,
  getTomorrowPushNotiOnStatusFetch,
  setDetailPushNotiOnFetch,
  setPushNotiOnFetch,
  setTomorrowPushNotiOnFetch,
} from '../apis/func';
import { COLOR } from '@/global/constants';
import {
  trackMyNotiLineOff,
  trackMyNotiLineOn,
  trackMyNotiPushOff,
  trackMyNotiPushOn,
  trackMyNotiTomorrowOff,
  trackMyNotiTomorrowOn,
} from '@/analytics/my.events';
import { trackMapBookmark1 } from '@/analytics/map.events';
import LoadingCircle from '@/global/components/animations/LoadingCircle';
import { IconExclamationMark, IconChevronRight2 } from '@/assets/icons';
import { LoadingScreen } from '@/global/components';

const NotiSettings = () => {
  const myPageNavigation = useMyPageNavigation();
  const rootNavigation = useRootNavigation();
  const queryClient = useQueryClient();
  const { email } = useSelector((state: RootState) => state.auth);

  const { myRoutes } = useGetSavedRoutesQuery();

  // 토글 on/off 여부
  const { data: isPushNotiOn } = useQuery(['getPushNotiOnStatus'], () =>
    getPushNotiOnStatusFetch(email),
  );
  const { data: isTomorrowPushNotiOn } = useQuery(['getTomorrowPushNotiOnStatus'], () =>
    getTomorrowPushNotiOnStatusFetch(email),
  );
  const { data: isDetailPushNotiOn } = useQuery(['getDetailPushNotiOnStatus'], () =>
    getDetailPushNotiOnStatusFetch(email),
  );

  // 토글 on/off 설정
  const { mutate: setPushNotiOnMutate, isLoading: isLoadingPushNotiToggle } = useMutation(
    setPushNotiOnFetch,
    {
      onSuccess: async (_, provider) => {
        if (provider.alertAgree) {
          trackMyNotiPushOn();
        } else {
          trackMyNotiPushOff();
        }
        await queryClient.invalidateQueries(['getPushNotiOnStatus']);
        await queryClient.invalidateQueries(['getTomorrowPushNotiOnStatus']);
        await queryClient.invalidateQueries(['getDetailPushNotiOnStatus']);
      },
    },
  );
  const { mutate: setTomorrowPushNotiOnMutate, isLoading: isLoadingTomorrowPushNotiToggle } =
    useMutation(setTomorrowPushNotiOnFetch, {
      onSuccess: async (_, provider) => {
        if (provider.alertAgree) {
          trackMyNotiTomorrowOn();
        } else {
          trackMyNotiTomorrowOff();
        }
        await queryClient.invalidateQueries(['getTomorrowPushNotiOnStatus']);
      },
    });
  const { mutate: setDetailPushNotiOnMutate, isLoading: isLoadingDetailPushNotiToggle } =
    useMutation(setDetailPushNotiOnFetch, {
      onSuccess: async (_, provider) => {
        if (provider.alertAgree) {
          trackMyNotiLineOn();
        } else {
          trackMyNotiLineOff();
        }
        await queryClient.invalidateQueries(['getDetailPushNotiOnStatus']);
      },
    });

  if (isPushNotiOn == null || isTomorrowPushNotiOn == null || isDetailPushNotiOn == null) {
    return <LoadingScreen />;
  }
  return (
    <>
      {(isLoadingPushNotiToggle ||
        isLoadingTomorrowPushNotiToggle ||
        isLoadingDetailPushNotiToggle) && (
        <View className="absolute items-center justify-center w-full h-full">
          <LoadingCircle />
        </View>
      )}

      <View className="flex-row items-center justify-between px-16 border-t border-gray-beb py-19">
        <FontText text="푸시 알림 받기" fontWeight="600" />
        <Toggle
          isOn={isPushNotiOn}
          onToggle={() => setPushNotiOnMutate({ email, alertAgree: !isPushNotiOn })}
        />
      </View>

      <View className="h-20 bg-gray-9f9" />

      <View className="flex-row items-center justify-between p-16 border-b border-gray-beb">
        <View className="space-y-6">
          <FontText
            text="내일 이슈 미리 알림"
            className={cn('text-purple-54f', {
              'text-gray-ebe': !isPushNotiOn,
            })}
            fontWeight="500"
          />
          <FontText
            text="내일 예정된 이슈가 있다면, 오늘 미리 알려드려요"
            className={cn('text-12 leading-14 text-gray-999', {
              'text-gray-ebe': !isPushNotiOn,
            })}
          />
        </View>
        <Toggle
          isOn={isTomorrowPushNotiOn}
          onToggle={() => setTomorrowPushNotiOnMutate({ email, alertAgree: !isTomorrowPushNotiOn })}
          disabled={!isPushNotiOn}
        />
      </View>

      <View className="flex-row items-center justify-between p-16 border-b border-gray-beb">
        <View className="space-y-6">
          <FontText
            text="경로별 상세 설정"
            className={cn('text-purple-54f', {
              'text-gray-ebe': !isPushNotiOn,
            })}
            fontWeight="500"
          />
          <FontText
            text={`경로마다 알림 받고싶은 시간을 설정할 수 있어요 \n설정하지 않으면 모든 시간에 알림을 보내드려요`}
            className={cn('text-12 leading-15 text-gray-999', {
              'text-gray-ebe': !isPushNotiOn,
            })}
          />
        </View>
        <Toggle
          isOn={isDetailPushNotiOn}
          onToggle={() => setDetailPushNotiOnMutate({ email, alertAgree: !isDetailPushNotiOn })}
          disabled={!isPushNotiOn}
        />
      </View>

      {isDetailPushNotiOn && myRoutes && myRoutes.length > 0 && (
        <ScrollView>
          {myRoutes.map((myRoutes, index) => (
            <Pressable
              key={myRoutes.roadName + index}
              style={({ pressed }) => ({
                backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: COLOR.GRAY_EB,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                paddingLeft: 24,
              })}
              onPress={() => myPageNavigation.push('NotiSettingsDetailScreen', { myRoutes })}
            >
              <FontText text={myRoutes.roadName} className="text-gray-999" fontWeight="500" />
              <View className="flex-row items-center space-x-4">
                <FontText text="편집" className="text-13 leading-19 text-gray-999" />
                <IconChevronRight2 />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {isDetailPushNotiOn && myRoutes && myRoutes.length < 1 && (
        <View className="items-center py-16 mx-16 mt-20 space-y-8 rounded-12 bg-gray-9f9">
          <View className="flex-row items-center space-x-4">
            <IconExclamationMark />
            <FontText text="저장한 경로가 아직 없어요" className="text-14 text-gray-999" />
          </View>
          <TouchableOpacity
            onPress={() => {
              trackMapBookmark1();
              rootNavigation.navigate('NewRouteNavigation', { screen: 'SavedRoutes' });
            }}
          >
            <FontText
              text="내 경로 저장하고 알림받기"
              className="underline text-13 text-gray-999"
              fontWeight="600"
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};
export default NotiSettings;
