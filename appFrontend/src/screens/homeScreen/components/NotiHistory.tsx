import { FontText } from '@/global/ui';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import IconNoNoti from '@assets/icons/no_result_icon.svg';
import TextNoNoti from '@/assets/icons/no_notihistory_text.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { COLOR } from '@/global/constants';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import IssueKeywordIcon from '@/global/components/IssueKeywordIcon';
import SettingsIcon from '@/assets/icons/icon_setting.svg';
import { useGetNotiHistoriesQuery } from '@/global/apis/hooks';
import cn from 'classname';
import { useMutation } from 'react-query';
import { updateNotiReadStatus } from '@/global/apis/func';
import { useFocusEffect } from '@react-navigation/native';

const NotiHistory = () => {
  const navigation = useRootNavigation();
  const dispatch = useAppDispatch();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { data, refetch, fetchNextPage, hasNextPage } = useGetNotiHistoriesQuery();
  const flattenedData = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) ?? [];
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const { mutate } = useMutation(updateNotiReadStatus);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-16">
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={20}>
          <IconLeftArrowHead color="#3F3F46" width={24} />
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
          return (
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: pressed ? COLOR.GRAY_E5 : COLOR.WHITE,
                flexDirection: 'row',
                paddingHorizontal: 16,
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderColor: COLOR.GRAY_EB,
              })}
              onPress={() => {
                dispatch(getIssueId(item.issueId));
                navigation.navigate('IssueStack', { screen: 'IssueDetail' });
                mutate(item.id);
              }}
              key={`${index}_${item.issueId}`}
            >
              <IssueKeywordIcon
                keyword={item.keyword}
                color={item.read ? COLOR.GRAY_DDD : COLOR.BASIC_BLACK}
                width={24}
                height={24}
              />
              <View className="flex-1 ml-12 mr-32">
                <FontText
                  text={item.notificationBody}
                  className={cn('text-14 leading-21', {
                    'text-gray-999': item.read,
                  })}
                  numberOfLines={2}
                  fontWeight="600"
                />
                <View className="h-4" />
                <FontText
                  text={item.notificationTitle}
                  className="text-12 leading-15 text-gray-999"
                />
              </View>
              <FontText
                text={item.agoTime}
                className="text-11 leading-13 text-gray-999"
                fontWeight="500"
              />
            </Pressable>
          );
        }}
        ListFooterComponent={<View className="h-64" />}
        ListEmptyComponent={
          <View className="items-center justify-center flex-1 pt-250 gap-17">
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
