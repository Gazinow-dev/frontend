import { FontText, Input } from '@/global/ui';
import cn from 'classname';
import { COLOR } from '@/global/constants';
import { KeyboardAvoidingView, Modal, Platform, View } from 'react-native';
import { useEffect, useState } from 'react';
import { SubwaySimplePath } from '@/global/components';
import { useSavedSubwayRoute } from '@/global/apis/hooks';
import { Path } from '@/global/apis/entity';
import { useQueryClient } from 'react-query';
import { showToast } from '@/global/utils/toast';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { trackMapSearchBookmarkFinish, trackMapSearchBookmarkName } from '@/analytics/map.events';
import { TouchableOpacity } from 'react-native';

interface Props {
  freshData: Path;
  closeModal: () => void;
  onBookmark: () => void;
  setMyPathId: (id: number) => void;
}

const NewRouteSaveModal = ({ freshData, closeModal, onBookmark, setMyPathId }: Props) => {
  const queryClient = useQueryClient();
  const navigation = useRootNavigation();

  const [isDuplicatedError, setIsDuplicatedError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [routeName, setRouteName] = useState<string>('');

  const newRouteData = {
    station_departure: freshData.firstStartStation,
    station_arrival: freshData.lastEndStation,
    line_departure: freshData.subPaths[0].name,
    line_arrival: freshData.subPaths.at(-1)?.name!,
  };

  const { isLoading, mutate } = useSavedSubwayRoute({
    onSuccess: async (id) => {
      await queryClient.invalidateQueries(['getRoads']);
      setMyPathId(id);
      onBookmark();
      closeModal();
      trackMapSearchBookmarkFinish({
        ...newRouteData,
        name: routeName,
      });
      navigation.navigate('MyPageNavigation', {
        screen: 'NotiSettingsDetailScreen',
        params: {
          myRoutes: { ...freshData, id, roadName: routeName },
          prevScreen: 'SaveModal',
        },
      });
      showToast('saveRoute');
    },
    onError: async ({ response }) => {
      setIsDuplicatedError(true);
      setErrorMessage(response.data.message);
    },
  });

  const saveHandler = () => {
    mutate({
      ...freshData,
      roadName: routeName,
    });
  };

  useEffect(() => {
    trackMapSearchBookmarkName(newRouteData);
  }, []);

  return (
    <Modal visible onRequestClose={closeModal} transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="items-center justify-center flex-1 min-w-296 bg-black/60"
      >
        <View className="items-center w-4/5 px-24 space-y-20 bg-white rounded-12 py-28">
          <FontText text="새 경로 저장" className="text-18 leading-23" fontWeight="600" />

          <View className="w-full">
            <View className="px-12 mb-20">
              <SubwaySimplePath
                pathData={freshData.subPaths}
                arriveStationName={freshData.lastEndStation}
                betweenPathMargin={16}
                isHideIsuue
              />
            </View>

            <FontText text="새 경로 이름" className="text-14 leading-21" fontWeight="500" />
            <View className="pt-12 pb-10 mt-5 mb-8 rounded-5 bg-gray-9f9 pl-15">
              <Input
                placeholder="경로 이름을 입력하세요"
                placeholderTextColor={COLOR.GRAY_999}
                value={routeName}
                maxLength={10}
                onChangeText={(text) => {
                  setIsDuplicatedError(false);
                  setRouteName(text);
                }}
                className="font-medium text-14 leading-16"
              />
            </View>

            <View className="flex-row items-center justify-between">
              <FontText
                text={errorMessage}
                className={cn('text-12 text-transparent', {
                  'text-light-red': isDuplicatedError,
                })}
                fontWeight="500"
              />
              <FontText
                text={routeName.length + '/10'}
                className="text-12 text-gray-ebe"
                fontWeight="500"
              />
            </View>
          </View>

          <View className="flex-row space-x-8">
            <TouchableOpacity
              className="items-center flex-1 py-12 border rounded-5 border-gray-999"
              onPress={closeModal}
            >
              <FontText text="취소" className="text-14 leading-21 text-gray-999" fontWeight="600" />
            </TouchableOpacity>
            <TouchableOpacity
              className={cn('flex-1 items-center rounded-5 bg-black-717 py-12', {
                'bg-gray-ddd': isLoading || isDuplicatedError || routeName.length < 1,
              })}
              onPress={saveHandler}
              disabled={isLoading || isDuplicatedError || routeName.length < 1}
            >
              <FontText text="확인" className="text-white text-14 leading-21" fontWeight="600" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default NewRouteSaveModal;
