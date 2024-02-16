import { css } from '@emotion/native';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FlatList, Modal, Platform, StatusBar, View } from 'react-native';
import { FontText } from '@/global/ui';
import { Path, SubPath } from '@/global/apis/entity';
import SearchPathDetailItem from '@/screens/searchPathResultDetailScreen/components/SearchPathDetailItem';
import { COLOR } from '@/global/constants';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import BackBtn from '@assets/icons/backBtn.svg';

interface ModalProps {
  item: Path;
  setDepth?: Dispatch<SetStateAction<'search' | 'pathList' | 'detail' | 'name'>>;
  onRequestClose?: () => void;
}

const NewRouteDetailModal = ({ item, setDepth, onRequestClose }: ModalProps) => {
  const StatusBarHeight =
    Platform.OS === 'ios'
      ? getStatusBarHeight(true) - 10
      : (StatusBar.currentHeight as number) - 24;

  const freshSubPathData: SubPath[] = useMemo(() => {
    const subPaths = item?.subPaths || [];
    return subPaths.filter((subPath) => !!subPath.lanes.length && !!subPath.stations.length);
  }, [item]);

  const onRequestCloseByProp = () => {
    if (setDepth) {
      setDepth('pathList');
    } else if (onRequestClose) {
      onRequestClose();
    }
  };

  return (
    <Modal onRequestClose={onRequestCloseByProp}>
      <View
        style={[
          css`
            background-color: white;
            flex: 1;
            padding: 0 16px;
          `,
          {
            paddingTop: StatusBarHeight,
          },
        ]}
      >
        {/* header */}
        <View
          style={{
            paddingVertical: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <BackBtn width="24px" onPress={onRequestCloseByProp} />
        </View>
        <View
          style={css`
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <View>
            <FontText
              value="평균 소요시간"
              textSize="12px"
              textWeight="Medium"
              lineHeight="14px"
              textColor="#999"
            />
            <View
              style={css`
                flex-direction: row;
                margin-top: 4px;
              `}
            >
              <FontText
                value={`${item.totalTime}분 소요`}
                textSize="24px"
                textWeight="Bold"
                lineHeight="32px"
              />
              <View
                style={css`
                  width: 8px;
                `}
              />
              <View>
                <View
                  style={css`
                    flex: 1;
                  `}
                />
                <FontText
                  value={`환승 ${freshSubPathData.length - 1}회`}
                  textSize="14px"
                  textWeight="Regular"
                  lineHeight="21px"
                  textColor="#999"
                />
              </View>
            </View>
          </View>
        </View>
        <View
          style={css`
            margin-bottom: 20px;
            margin-top: 22px;
            height: 1px;
            background-color: ${COLOR.GRAY_EB};
          `}
        />
        <FlatList
          data={freshSubPathData}
          keyExtractor={(item) => item.distance + item.sectionTime + ''}
          ListFooterComponent={<View style={{ height: 100 }} />}
          renderItem={({ item, index }) => (
            <SearchPathDetailItem data={item} isLastLane={freshSubPathData.length - 1 === index} />
          )}
        />
      </View>
    </Modal>
  );
};

export default NewRouteDetailModal;
