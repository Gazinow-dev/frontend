import { View } from 'react-native';
import { FontText } from '.';
import ToastCheck from '@assets/icons/toast_check.svg';
import ToastWarning from '@assets/icons/toast_warning.svg';

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
      {isWarning ? <ToastWarning /> : <ToastCheck />}
      <FontText text={text} className="ml-10 text-white text-14" fontWeight="500" />
    </View>
  );
};

export default Toast;
