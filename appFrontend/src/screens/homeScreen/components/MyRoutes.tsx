import { View } from 'react-native';
import cn from 'classname';
import { FontText } from '@/global/ui';
import { useGetSavedRoutesQuery } from '@/global/apis/hooks';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NonLoggedIn, RouteItem, NoRoutes } from '.';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import RetryLoad from '@/global/components/RetryLoad';
import IconInfo from '@/assets/icons/info.svg';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import { getTomorrowPushNotiOnStatusFetch } from '@/screens/myRootScreen/apis/func';
import IssueKeywordIcon from '@/global/components/IssueKeywordIcon';
import { COLOR } from '@/global/constants';
import IconX from '@assets/icons/cross_x.svg';
import { Shadow } from 'react-native-shadow-2';
interface MyRoutesProps {
  isVerifiedUser: 'success auth' | 'fail auth' | 'yet';
  isRefreshing: boolean;
  setIsRefreshing: (isRefreshing: boolean) => void;
}

const MyRoutes = ({ isVerifiedUser, isRefreshing, setIsRefreshing }: MyRoutesProps) => {
  const navigation = useRootNavigation();
  const homeNavigation = useHomeNavigation();

  const { myRoutes, getSavedRoutesRefetch, isSavedRoutesError } = useGetSavedRoutesQuery();
  const queryClient = useQueryClient();

  const { email } = useSelector((state: RootState) => state.auth);

  // 익일 알림 설정 on/off 여부
  const { data: isTomorrowPushNotiOn } = useQuery(['getTomorrowPushNotiOnStatus'], () =>
    getTomorrowPushNotiOnStatusFetch(email),
  );

  const [isInfoVisible, setInfoVisible] = useState(false);
  const showInfoHandler = () => setInfoVisible(!isInfoVisible);

  const editMyRoutesHandler = () =>
    isVerifiedUser === 'success auth'
      ? homeNavigation.navigate('SavedRoutes')
      : navigation.navigate('AuthStack', { screen: 'Landing' });

  useEffect(() => {
    queryClient.invalidateQueries(['getRoads']);
    if (isRefreshing) {
      getSavedRoutesRefetch();
    }
    setIsRefreshing(false);
  }, [isRefreshing]);

  const renderMyRoutes = () => {
    if (isVerifiedUser !== 'success auth') {
      return <NonLoggedIn />;
    }
    if (myRoutes && myRoutes.length < 1) {
      return <NoRoutes />;
    }
    if (isSavedRoutesError) {
      return (
        <View className="border-t-1 border-gray-beb">
          <RetryLoad retryFn={getSavedRoutesRefetch} />
        </View>
      );
    }
    return myRoutes?.map((myRoute, index) => {
      const hasIssues = myRoute.subPaths.some((subPath) => !!subPath.issueSummary.length);
      return (
        <RouteItem
          key={myRoute.id}
          route={myRoute}
          hasIssues={hasIssues}
          isLastItem={index === myRoutes.length - 1}
        />
      );
    });
  };

  return (
    <View className="relative mt-16 bg-white rounded-14">
      <View className="flex-row items-center justify-between p-16 pt-20">
        <View className="flex-row gap-4">
          <FontText
            text="내가 저장한 경로"
            className={cn('text-18 leading-23', {
              'text-gray-999': isVerifiedUser !== 'success auth',
            })}
            fontWeight="600"
          />
          <TouchableOpacity onPress={showInfoHandler} hitSlop={20}>
            <IconInfo />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={editMyRoutesHandler} hitSlop={20}>
          <FontText text="저장경로 편집" className="text-13 leading-19 text-gray-999" />
        </TouchableOpacity>
      </View>

      {renderMyRoutes()}

      {isInfoVisible && (
        <Shadow
          distance={29}
          offset={[0, 7]}
          startColor="#64646F10"
          containerStyle={{ position: 'absolute', top: 48, left: 10, zIndex: 10 }}
        >
          <View
            className="border border-gray-beb rounded-10 bg-white
                  px-12 py-14 w-[264px] overflow-hidden space-y-10"
          >
            <View className="flex-row">
              <View className="flex-1 gap-2 py-2">
                <FontText
                  text="어떤 정보가 보여지나요?"
                  className="text-14 leading-21"
                  fontWeight="600"
                />
                <FontText
                  text={
                    isTomorrowPushNotiOn
                      ? '내가 저장한 경로와 관련된 전날 21시 ~ 오늘 24시까지의 이슈가 표시돼요'
                      : '내가 저장한 경로와 관련된 오늘 24시까지의 이슈가 표시돼요'
                  }
                  className="text-12 leading-15 text-gray-999"
                />
              </View>
              <TouchableOpacity onPress={showInfoHandler} hitSlop={20}>
                <IconX />
              </TouchableOpacity>
            </View>

            <View className="flex-1 h-1 bg-gray-beb" />

            <View className="space-y-10">
              <View className="flex-row items-center gap-10">
                <View>
                  <IssueKeywordIcon keyword="자연재해" color={COLOR.LINE4} width={30} height={30} />
                </View>
                <View className="flex-1 space-y-2">
                  <FontText text="진행 중 이슈" className="text-13 leading-19" fontWeight="600" />
                  <FontText
                    text="현재 경로에 영향을 줄 수 있는 진행중인 이슈예요"
                    className="text-12 leading-15 text-gray-999"
                  />
                </View>
              </View>
              <View className="flex-row items-center gap-10">
                <View>
                  <IssueKeywordIcon keyword="자연재해" color="#0EB5EB66" width={30} height={30} />
                </View>
                <View className="flex-1 space-y-2 ">
                  <FontText text="예정 이슈" className="text-13 leading-19" fontWeight="600" />
                  <FontText
                    text="저장된 경로에 영향을 줄 수 있는, 곧 시작될 예정 이슈예요"
                    className="text-12 leading-15 text-gray-999"
                  />
                </View>
              </View>
            </View>
          </View>
        </Shadow>
      )}
    </View>
  );
};

export default MyRoutes;
