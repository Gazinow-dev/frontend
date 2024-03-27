import LoadingAnimations from '@/global/components/animations/LoadingAnimations';
import { COLOR } from '@/global/constants';
import { TextButton } from '@/global/ui';
import { View } from 'react-native';

interface StepButtonProps {
  value: string;
  disabled?: boolean;
  backgroundCondition: boolean;
  onPress: () => void;
  isLoading?: boolean;
}

const StepButton = ({
  value,
  disabled,
  backgroundCondition,
  onPress,
  isLoading,
}: StepButtonProps) => {
  return (
    <>
      {isLoading ? (
        <View
          style={{
            backgroundColor: COLOR.GRAY_DDD,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            marginBottom: 41,
            flexDirection: 'row',
          }}
        >
          <LoadingAnimations color="white" width={34} height={27} />
          <TextButton value={value} textSize="17px" textWeight="SemiBold" textColor={COLOR.WHITE} />
        </View>
      ) : (
        <TextButton
          value={value}
          textSize="17px"
          textWeight="SemiBold"
          textColor={COLOR.WHITE}
          style={{
            backgroundColor: backgroundCondition ? COLOR.BASIC_BLACK : COLOR.GRAY_DDD,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            marginBottom: 41,
          }}
          onPress={onPress}
          disabled={disabled}
        />
      )}
    </>
  );
};

export default StepButton;
