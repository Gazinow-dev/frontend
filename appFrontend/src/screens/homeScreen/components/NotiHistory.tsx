import { FontText } from '@/global/ui';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import IconNoNoti from '@assets/icons/no_result_icon.svg';
import TextNoNoti from '@/assets/icons/no_notihistory_text.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import SettingsIcon from '@/assets/icons/icon_setting.svg';
import { useGetNotiHistoriesQuery } from '@/global/apis/hooks';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingScreen, NetworkErrorScreen } from '@/global/components';
import UpdateNotiCard from './UpdateNotiCard';
import PathNotiCard from './PathNotiCard';

const NotiHistory = () => {
  const navigation = useRootNavigation();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { data, refetch, fetchNextPage, hasNextPage, isLoading, isError } =
    useGetNotiHistoriesQuery();

  const flattenedData = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) ?? [];
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (isError || !data) {
    return <NetworkErrorScreen retryFn={refetch} />;
  }
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between p-16">
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={20}>
          <IconChevronLeft />
        </TouchableOpacity>

        <FontText text="알림" className="text-18 leading-23" fontWeight="500" />

        <TouchableOpacity
          onPress={() => navigation.push('MyPageNavigation', { screen: 'NotiSettingsScreen' })}
          hitSlop={20}
        >
          <SettingsIcon />
        </TouchableOpacity>
      </View>

      <FlatList
        data={flattenedData}
        renderItem={({ item, index }) => {
          if (item.keyword === '관리자') {
            return <UpdateNotiCard index={index} item={item} />;
          }
          return <PathNotiCard index={index} item={item} />;
        }}
        ListFooterComponent={<View className="h-64" />}
        ListEmptyComponent={
          <View className="items-center justify-center flex-1 gap-17 pt-250">
            <IconNoNoti />
            <TextNoNoti />
          </View>
        }
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        refreshControl={
          <RefreshControl
            onRefresh={async () => {
              setIsRefreshing(true);
              await refetch();
              setIsRefreshing(false);
            }}
            refreshing={isRefreshing}
            progressViewOffset={-10}
          />
        }
      />
    </SafeAreaView>
  );
};

export default NotiHistory;
