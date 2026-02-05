import LoadingDots from '@/global/components/animations/LoadingDots';
import { FontText } from '@/global/ui';
import { TouchableOpacity, View } from 'react-native';
import cn from 'classname';

interface Props {
  value: string;
  disabled?: boolean;
  backgroundCondition: boolean;
  onPress: () => void;
  isLoading?: boolean;
}

const StepButton = ({ value, disabled, backgroundCondition, onPress, isLoading }: Props) => {
  return (
    <>
      {isLoading ? (
        <View className="items-center justify-center h-48 pt-8 mb-41 rounded-5 bg-gray-ddd">
          <LoadingDots width={160} height={72} />
        </View>
      ) : (
        <TouchableOpacity
          className={cn('mb-41 h-48 items-center justify-center rounded-5', {
            'bg-black-717': backgroundCondition,
            'bg-gray-ddd': !backgroundCondition,
          })}
          onPress={onPress}
          disabled={disabled}
        >
          <FontText text={value} className="text-white text-17" fontWeight="600" />
        </TouchableOpacity>
      )}
    </>
  );
};

export default StepButton;
