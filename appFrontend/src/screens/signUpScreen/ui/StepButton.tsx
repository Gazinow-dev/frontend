import LoadingDots from '@/global/components/animations/LoadingDots';
import { FontText } from '@/global/ui';
import { Pressable, View } from 'react-native';
import cn from 'classname';

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
        <View className="items-center justify-center h-48 pt-8 bg-black-717 rounded-5 mb-41">
          <LoadingDots width={200} height={90} />
        </View>
      ) : (
        <Pressable
          className={cn('rounded-5 items-center justify-center h-48 mb-41', {
            'bg-black-717': backgroundCondition,
            'bg-gray-ddd': !backgroundCondition,
          })}
          onPress={onPress}
          disabled={disabled}
        >
          <FontText text={value} className="text-white text-17" fontWeight="600" />
        </Pressable>
      )}
    </>
  );
};

export default StepButton;
