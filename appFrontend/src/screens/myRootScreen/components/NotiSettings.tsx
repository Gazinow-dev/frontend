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

  return (
    <>
      {(isLoadingPushNotiToggle ||
        isLoadingTomorrowPushNotiToggle ||
        isLoadingDetailPushNotiToggle) && (
        <View className="absolute h-full w-full items-center justify-center">
          <LoadingCircle />
        </View>
      )}
      <View className="h-1 bg-gray-beb" />
      <View className="mx-16 h-53 flex-row items-center justify-between">
        <FontText
          text="푸시 알림 받기"
          className={cn({
            'text-gray-ebe': !isPushNotiOn,
          })}
          fontWeight="600"
        />
        <Toggle
          isOn={isPushNotiOn!}
          onToggle={() => setPushNotiOnMutate({ email, alertAgree: !isPushNotiOn })}
        />
      </View>
      <View className="h-20 bg-gray-9f9" />
      <>
        <View className="mx-16 h-72 flex-row items-center justify-between">
          <View className="gap-6">
            <FontText
              text="내일 이슈 미리 알림"
              className={cn({
                'text-gray-ebe': !isTomorrowPushNotiOn,
              })}
              fontWeight="500"
            />

            <FontText
              text="내일 예정된 이슈가 있다면, 오늘 미리 알려드려요"
              className={cn('text-12 leading-14 text-gray-999', {
                'text-gray-ebe': !isTomorrowPushNotiOn,
              })}
              fontWeight="400"
            />
          </View>
          <Toggle
            isOn={isTomorrowPushNotiOn!}
            onToggle={() =>
              setTomorrowPushNotiOnMutate({ email, alertAgree: !isTomorrowPushNotiOn })
            }
            disabled={!isPushNotiOn}
          />
        </View>
        <View className="h-1 bg-gray-beb" />
      </>
      <>
        <View className="mx-16 h-72 flex-row items-center justify-between">
          <View className="gap-6">
            <FontText
              text="경로별 상세 설정"
              className={cn({
                'text-gray-ebe': !isDetailPushNotiOn,
              })}
              fontWeight="500"
            />

            <FontText
              text={`경로마다 알림 받고싶은 시간을 설정할 수 있어요\n설정하지 않으면 모든 시간에 알림을 보내드려요`}
              className={cn('text-12 leading-14 text-gray-999', {
                'text-gray-ebe': !isDetailPushNotiOn,
              })}
              fontWeight="400"
            />
          </View>
          <Toggle
            isOn={isDetailPushNotiOn!}
            onToggle={() => setDetailPushNotiOnMutate({ email, alertAgree: !isDetailPushNotiOn })}
            disabled={!isPushNotiOn}
          />
        </View>
        <View className="h-1 bg-gray-beb" />
      </>
      {isDetailPushNotiOn && myRoutes && myRoutes.length > 0 && (
        <ScrollView>
          {myRoutes.map((myRoutes, index) => (
            <View key={myRoutes.roadName + index}>
              <Pressable
                style={({ pressed }) => ({
                  backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingLeft: 24,
                  paddingRight: 16,
                  height: 53,
                })}
                onPress={() => myPageNavigation.push('NotiSettingsDetailScreen', { myRoutes })}
              >
                <FontText text={myRoutes.roadName} className="text-gray-999" fontWeight="500" />
                <View className="flex-row items-center">
                  <FontText text="편집" className="text-13 leading-19 text-gray-999" />
                  <IconChevronRight2 height={19} className="ml-4" />
                </View>
              </Pressable>
              <View className="h-1 bg-gray-beb" />
            </View>
          ))}
        </ScrollView>
      )}
      {isDetailPushNotiOn && myRoutes && myRoutes.length < 1 && (
        <View className="mx-16 mt-20 items-center rounded-12 bg-gray-9f9 py-16">
          <View className="flex-row items-center">
            <IconExclamationMark />
            <FontText className="pl-5 text-14 text-gray-999" text={'저장한 경로가 아직 없어요'} />
          </View>
          <TouchableOpacity
            className="mt-8"
            onPress={() => {
              trackMapBookmark1();
              rootNavigation.navigate('NewRouteNavigation', { screen: 'SavedRoutes' });
            }}
          >
            <FontText
              text="내 경로 저장하고 알림받기"
              className="text-13 text-gray-999"
              fontWeight="600"
            />
            <View className="border-b-[1.5px] border-b-gray-999" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};
export default NotiSettings;
