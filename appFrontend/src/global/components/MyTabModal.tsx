import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { FontText } from '@/global/ui';

interface ModalProps {
  isVisible: boolean;
  onCancel?: () => void;
  onConfirm: () => void;
  title: string;
  confirmText: string;
  cancelText?: string;
}

const MyTabModal = ({
  isVisible,
  onCancel,
  onConfirm,
  title,
  confirmText,
  cancelText,
}: ModalProps) => {
  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onCancel}>
      <View className="items-center justify-center flex-1 bg-[#00000060]">
        <View className="items-center justify-between bg-white w-[81%] h-160 p-24 pt-32 rounded-10">
          <FontText text={title} className="text-18" fontWeight="600" />
          <View className="flex-row gap-8">
            {cancelText && (
              <TouchableOpacity
                className="items-center flex-1 p-12 border-1 border-gray-999 rounded-5"
                onPress={onCancel}
              >
                <FontText text={cancelText} className="text-gray-999 leading-21" fontWeight="600" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="items-center flex-1 p-12 bg-black-717 rounded-5"
              onPress={onConfirm}
            >
              <FontText text={confirmText} className="text-white leading-21" fontWeight="600" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MyTabModal;
