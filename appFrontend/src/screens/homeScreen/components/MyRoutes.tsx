import { View } from 'react-native';
import cn from 'classname';
import { FontText } from '@/global/ui';
import { useGetSavedRoutesQuery } from '@/global/apis/hooks';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NonLoggedIn, RouteItem, NoRoutes } from '.';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useHomeNavigation } from '@/navigation/HomeNavigation';

interface MyRoutesProps {
  isVerifiedUser: 'success auth' | 'fail auth' | 'yet';
  isRefreshing: boolean;
  setIsRefreshing: (isRefreshing: boolean) => void;
}

const MyRoutes = ({ isVerifiedUser, isRefreshing, setIsRefreshing }: MyRoutesProps) => {
  const navigation = useRootNavigation();
  const homeNavigation = useHomeNavigation();

  const { myRoutes, getSavedRoutesRefetch } = useGetSavedRoutesQuery();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries(['getRoads']);
    if (isRefreshing) {
      getSavedRoutesRefetch();
    }
    setIsRefreshing(false);
  }, [isRefreshing]);

  const editMyRoutesHandler = () =>
    isVerifiedUser === 'success auth'
      ? homeNavigation.navigate('SavedRoutes')
      : navigation.navigate('AuthStack', { screen: 'Landing' });

  const renderMyRoutes = () => {
    if (isVerifiedUser !== 'success auth') {
      return <NonLoggedIn />;
    }
    if (myRoutes && myRoutes.length < 1) {
      return <NoRoutes />;
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
    <View className="my-16 bg-white rounded-14">
      <View className="flex-row items-center justify-between p-16">
        <FontText
          text="내가 저장한 경로"
          className={cn('text-18 leading-23', {
            'text-black': isVerifiedUser === 'success auth',
            'text-gray-999': isVerifiedUser !== 'success auth',
          })}
          fontWeight="600"
        />
        <TouchableOpacity onPress={editMyRoutesHandler} hitSlop={20}>
          <FontText text="저장경로 편집" className="text-12 leading-15 text-gray-999" />
        </TouchableOpacity>
      </View>
      {renderMyRoutes()}
    </View>
  );
};

export default MyRoutes;
