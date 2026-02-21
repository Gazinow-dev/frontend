import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { FontText } from '@/global/ui';

interface Props {
  isVisible: boolean;
  title: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText: string;
  cancelText?: string;
}

const MyTabModal = ({ isVisible, onCancel, onConfirm, title, confirmText, cancelText }: Props) => {
  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-[#00000060]">
        <View className="w-[81%] items-center justify-between space-y-20 rounded-12 bg-white px-24 py-28">
          <FontText text={title} className="text-18" fontWeight="600" />
          <View className="flex-row space-x-8">
            {cancelText && (
              <TouchableOpacity
                className="flex-1 p-12 rounded-5 border-1 border-gray-999"
                onPress={onCancel}
              >
                <FontText
                  text={cancelText}
                  className="text-center text-14 leading-21 text-gray-999"
                  fontWeight="600"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity className="flex-1 p-12 rounded-5 bg-black-717" onPress={onConfirm}>
              <FontText
                text={confirmText}
                className="text-center text-white text-14 leading-21"
                fontWeight="600"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MyTabModal;
