import { FontText, Input, Space } from '@/global/ui';
import cn from 'classname';
import { COLOR } from '@/global/constants';
import { KeyboardAvoidingView, Modal, Platform, Pressable, View } from 'react-native';
import { useState } from 'react';
import { SubwaySimplePath } from '@/global/components';
import { useSavedSubwayRoute } from '@/global/apis/hooks';
import { Path } from '@/global/apis/entity';
import { useQueryClient } from 'react-query';
import { showToast } from '@/global/utils/toast';
import { useRootNavigation } from '@/navigation/RootNavigation';

interface NewRouteSaveModalProps {
  freshData: Path;
  closeModal: () => void;
  onBookmark: () => void;
  setMyPathId: (id: number) => void;
}
const NewRouteSaveModal = ({
  freshData,
  closeModal,
  onBookmark,
  setMyPathId,
}: NewRouteSaveModalProps) => {
  const queryClient = useQueryClient();
  const navigation = useRootNavigation();

  const [isDuplicatedError, setIsDuplicatedError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [routeName, setRouteName] = useState<string>('');

  const { isLoading, mutate } = useSavedSubwayRoute({
    onSuccess: async (id) => {
      await queryClient.invalidateQueries(['getRoads']);
      setMyPathId(id);
      onBookmark();
      closeModal();
      navigation.navigate('MyPageNavigation', {
        screen: 'NotiSettingsDetailScreen',
        params: { myRoutes: { ...freshData, id, roadName: routeName } },
      });
      showToast('saveRoute');
    },
    onError: async ({ response }) => {
      setIsDuplicatedError(true);
      setErrorMessage(response.data.message);
    },
  });

  const saveHandler = () => {
    if (routeName.length === 0) return;
    mutate({
      ...freshData,
      roadName: routeName,
    });
  };

  return (
    <Modal visible onRequestClose={closeModal} transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.60)',
          flex: 1,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 296,
        }}
      >
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            paddingVertical: 28,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignItems: 'center',
            maxWidth: 296,
            width: '100%',
          }}
        >
          <FontText text="새 경로 저장" className="text-18" fontWeight="600" />

          <View style={{ width: '100%', marginVertical: 4 }}>
            <SubwaySimplePath
              pathData={freshData.subPaths}
              arriveStationName={freshData.lastEndStation}
              betweenPathMargin={16}
              isHideIsuue
            />
          </View>

          <View className="w-full">
            <FontText text="새 경로 이름" className="text-14" fontWeight="500" />
            <View
              style={{
                borderRadius: 5,
                backgroundColor: COLOR.GRAY_F9,
                width: '100%',
                paddingLeft: 15,
                paddingTop: 12.31,
                paddingBottom: 10.69,
                marginTop: 5.48,
                marginBottom: 8.31,
              }}
            >
              <Input
                placeholder="경로 이름을 입력하세요"
                placeholderTextColor={COLOR.GRAY_999}
                value={routeName}
                onChangeText={(text) => {
                  if (text.length <= 10) {
                    setIsDuplicatedError(false);
                    setRouteName(text);
                  }
                }}
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  lineHeight: 16,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
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

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
            <Pressable
              className="items-center flex-1 py-12 border rounded-5 border-gray-999"
              onPress={closeModal}
            >
              <FontText text="취소" className="text-gray-999 text-14" fontWeight="600" />
            </Pressable>
            <Space width={8} />
            <Pressable
              className={cn('py-12 rounded-5 flex-1 items-center bg-black-717', {
                'bg-gray-ddd': isLoading || isDuplicatedError || routeName.length < 1,
              })}
              onPress={saveHandler}
              disabled={isLoading || isDuplicatedError}
            >
              <FontText text="확인" className="text-white text-14" fontWeight="600" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default NewRouteSaveModal;
