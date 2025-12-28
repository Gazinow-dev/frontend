import { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { FontText, Space } from '@/global/ui';
import { useRoute } from '@react-navigation/native';
import NewRouteSaveModal from './components/NewRouteSaveModal';
import SearchPathDetailItem from './components/SearchPathDetailItem';
import { Path, SubPath } from '@/global/apis/entity';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import { COLOR } from '@/global/constants';
import { useMutation, useQueryClient } from 'react-query';
import IconBookmark from '@assets/icons/bookmark.svg';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import { useAppSelect } from '@/store';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { showToast } from '@/global/utils/toast';
import { myPathDeleteFetch, updateNotiReadStatus } from '@/global/apis/func';
import { trackMapBookmarkDelete } from '@/analytics/map.events';

interface DetailData extends Path {
  id: number;
}

const SearchPathResultDetailScreen = () => {
  const queryClient = useQueryClient();
  const navigation = useHomeNavigation();
  const rootNavigation = useRootNavigation();
  const { state: resultData, notificationId } = useRoute().params as {
    state: DetailData;
    notificationId: number;
  };
  const { mutate } = useMutation(updateNotiReadStatus);

  useEffect(() => {
    if (notificationId) {
      mutate(notificationId);
    }
  }, []);

  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);

  const { mutate: deleteMutate, isLoading } = useMutation(myPathDeleteFetch, {
    onSuccess: async () => {
      const trackData = {
        station_departure: resultData.subPaths[0].stations[0].stationName,
        station_arrival: resultData.subPaths.at(-1)?.stations.at(-1)?.stationName!,
        line_departure: resultData.subPaths[0].name,
        line_arrival: resultData.subPaths.at(-1)?.name!,
      };
      trackMapBookmarkDelete(trackData);
      setIsBookmarking(false);
      await queryClient.invalidateQueries('getRoads');
      showToast('deleteRoute');
    },
  });

  const [myPathId, setMyPathId] = useState<number | null>(
    resultData.id || (resultData.myPathId ? resultData.myPathId[0] : null),
  );
  const [isBookmarking, setIsBookmarking] = useState<boolean>(resultData.myPath ?? !!resultData.id);
  const [isSaveRouteModalOpen, setIsSaveRouteModalOpen] = useState<boolean>(false);

  const freshSubPathData: SubPath[] = useMemo(() => {
    if (!resultData.subPaths) return [];
    const subPaths = resultData.subPaths;
    return Object.values(subPaths).filter((item) => !!item.stations.length);
  }, [resultData]);

  const bookmarkHandler = () => {
    if (!isBookmarking) {
      setIsSaveRouteModalOpen(true);
      return;
    } else if (myPathId) {
      deleteMutate({ id: myPathId });
    }
  };

  const isOccurIssue = useMemo(() => {
    return resultData.subPaths.some((item) => !!item.issueSummary.length);
  }, [resultData]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-16">
        {/* header */}
        <View className="flex-row items-center justify-between py-16">
          <TouchableOpacity hitSlop={20} onPress={() => navigation.goBack()}>
            <IconLeftArrowHead color="#3F3F46" width={18} height={18} />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={20} onPress={bookmarkHandler} disabled={isLoading}>
            <IconBookmark
              width={24}
              height={24}
              stroke={isBookmarking ? 'none' : COLOR.GRAY_999}
              strokeWidth={2}
              fill={isBookmarking ? COLOR.LIGHT_BLUE : 'transparent'}
            />
          </TouchableOpacity>
          {isSaveRouteModalOpen &&
            (isVerifiedUser === 'success auth' ? (
              <NewRouteSaveModal
                freshData={{ ...resultData, subPaths: freshSubPathData }}
                closeModal={() => setIsSaveRouteModalOpen(false)}
                onBookmark={() => setIsBookmarking(true)}
                setMyPathId={(id: number) => setMyPathId(id)}
              />
            ) : (
              <Modal visible onRequestClose={() => setIsSaveRouteModalOpen(false)} transparent>
                <View className="relative items-center justify-center flex-1">
                  <View className="absolute top-0 h-full w-full bg-[#00000099]" />
                  <View className="absolute w-4/5 px-24 pt-32 pb-24 bg-white rounded-12">
                    <FontText
                      text={`로그인하면 관심 경로의\n이슈를 알려드려요`}
                      className="text-center text-18"
                      fontWeight="600"
                    />
                    <View className="flex-row w-full mt-30 gap-x-8">
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="items-center flex-1 py-12 border rounded-5 border-gray-999"
                        onPress={() => setIsSaveRouteModalOpen(false)}
                      >
                        <FontText text="취소" className="text-14 text-gray-999" fontWeight="600" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="items-center flex-1 py-12 rounded-5 bg-black-717"
                        onPress={() => {
                          setIsSaveRouteModalOpen(false);
                          rootNavigation.navigate('AuthStack', { screen: 'Landing' });
                        }}
                      >
                        <FontText text="로그인" className="text-white text-14" fontWeight="600" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            ))}
        </View>

        <View className="flex-row items-center justify-between pl-10">
          <View>
            <FontText text="평균 소요시간" className="text-13 text-gray-999" fontWeight="500" />
            <View className="flex-row mt-2">
              <FontText
                text={
                  resultData.totalTime > 60
                    ? Math.floor(resultData.totalTime / 60) +
                      '시간 ' +
                      (resultData.totalTime % 60) +
                      `분 ${isOccurIssue ? '이상' : ''}`
                    : resultData.totalTime + `분 ${isOccurIssue ? '이상' : ''}`
                }
                className="text-28"
                fontWeight="700"
              />

              <Space width={8} />

              <View>
                <View className="flex-1" />
                <FontText
                  text={
                    freshSubPathData.length - 1 === 0
                      ? '환승없음'
                      : '환승 ' + (freshSubPathData.length - 1) + '회'
                  }
                  className="mb-2 text-gray-999"
                />
              </View>
            </View>
          </View>
        </View>

        {/* 경계선 */}
        <View className="h-px mt-16 mb-21 bg-gray-beb" />

        <FlatList
          data={freshSubPathData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => {
            if (typeof item === 'string') return 'dance';
            return item.distance + 'detail' + item.sectionTime;
          }}
          renderItem={({ item, index }) => {
            return (
              <SearchPathDetailItem
                data={item}
                isLastLane={freshSubPathData.length - 1 === index}
                lineLength={freshSubPathData.length}
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchPathResultDetailScreen;
