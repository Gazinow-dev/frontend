import { ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { LineCapsules } from '@/global/apis/entity';
import { LINE_CAPSULES } from '@/global/constants';
import { FontText } from '@/global/ui';
import { lineCapsuleToColor } from '@/global/utils';
import { trackNowTotalIssueLine } from '@/analytics/now.events';

interface Props {
  activeButton: LineCapsules;
  setActiveButton: (activeButton: LineCapsules) => void;
}

const LaneButtons = ({ activeButton, setActiveButton }: Props) => {
  return (
    <View>
      <ScrollView
        fadingEdgeLength={130}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className="space-x-12 pb-14 pt-4"
      >
        <View className="w-4" />
        {LINE_CAPSULES.map((capsule) => (
          <TouchableOpacity
            key={capsule}
            onPress={() => {
              trackNowTotalIssueLine(capsule);
              setActiveButton(capsule);
            }}
            className="rounded-17 px-[8.48px] py-[6.79px]"
            style={{
              backgroundColor: activeButton === capsule ? lineCapsuleToColor(capsule) : '#F5F5F5',
            }}
          >
            <FontText
              text={capsule}
              style={{
                color: activeButton === capsule ? 'white' : lineCapsuleToColor(capsule),
              }}
              className="text-[12.92px] leading-[15.51px]"
              fontWeight="600"
            />
          </TouchableOpacity>
        ))}
        <View className="w-4" />
      </ScrollView>
    </View>
  );
};

export default LaneButtons;
