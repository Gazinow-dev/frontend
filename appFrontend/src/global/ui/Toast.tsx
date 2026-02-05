import { View } from 'react-native';
import { FontText } from '.';
import { IconToastCheck, IconToastWarning } from '@/assets/icons';

interface Props {
  text: string;
  isWarning?: boolean;
}

const Toast = ({ text, isWarning }: Props) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#00000080',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 999,
      }}
    >
      {isWarning ? <IconToastWarning /> : <IconToastCheck />}
      <FontText text={text} className="ml-10 text-14 text-white" fontWeight="500" />
    </View>
  );
};

export default Toast;
