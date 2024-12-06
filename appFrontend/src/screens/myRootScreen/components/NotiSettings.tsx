import { FontText, Toggle } from '@/global/ui';
import cn from 'classname';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { useGetSavedRoutesQuery } from '@/global/apis/hooks';
import MoreBtn from '@/assets/icons/moreBtn.svg';
import IconExclamation from '@assets/icons/circle_exclamation_mark.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  getDetailPushNotiOnStatusFetch,
  getPushNotiOnStatusFetch,
  setDetailPushNotiOnFetch,
  setPushNotiOnFetch,
} from '../apis/func';
import { COLOR } from '@/global/constants';

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
  const { data: isDetailPushNotiOn } = useQuery(['getDetailPushNotiOnStatus'], () =>
    getDetailPushNotiOnStatusFetch(email),
  );

  // 토글 on/off 설정
  const { mutate: setPushNotiOnMutate } = useMutation(setPushNotiOnFetch, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['getPushNotiOnStatus']);
      await queryClient.invalidateQueries(['getMyPathPushNotiOnStatus']);
      await queryClient.invalidateQueries(['getDetailPushNotiOnStatus']);
    },
  });
  const { mutate: setDetailPushNotiOnMutate } = useMutation(setDetailPushNotiOnFetch, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['getDetailPushNotiOnStatus']);
    },
  });

  return (
    <>
      <View className="h-1 bg-gray-beb" />
      <View className="flex-row items-center justify-between mx-16 h-53">
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
        <View className="flex-row items-center justify-between mx-16 h-72">
          <View className="gap-6">
            <FontText
              text="내가 저장한 경로 알림 설정"
              className={cn({
                'text-gray-ebe': !isDetailPushNotiOn,
              })}
              fontWeight="600"
            />

            <FontText
              text="개별 경로의 알림을 각각 다르게 설정할 수 있어요"
              className={cn('text-12 leading-14', {
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
                  <FontText text="편집" className="text-gray-999 text-13 leading-19" />
                  <MoreBtn height={19} className="ml-4" />
                </View>
              </Pressable>
              <View className="h-1 bg-gray-beb" />
            </View>
          ))}
        </ScrollView>
      )}
      {isDetailPushNotiOn && myRoutes && myRoutes.length < 1 && (
        <View className="items-center py-16 mx-16 mt-20 bg-gray-9f9 rounded-12">
          <View className="flex-row items-center">
            <IconExclamation />
            <FontText className="pl-5 text-gray-999 text-14" text={'저장한 경로가 아직 없어요'} />
          </View>
          <TouchableOpacity
            className="mt-8"
            onPress={() => rootNavigation.navigate('NewRouteNavigation', { screen: 'SavedRoutes' })}
          >
            <FontText
              text={'내 경로 저장하고 알림받기'}
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
