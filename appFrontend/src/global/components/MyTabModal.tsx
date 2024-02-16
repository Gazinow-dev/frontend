import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import styled from '@emotion/native';
import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';

interface ModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  title: string;
  confirmText?: string;
  cancelText: string;
  btnColor?: string;
  inputValue?: string;
  setInputValue?: (value: string) => void;
}

const MyTabModal = ({
  isVisible,
  onCancel,
  onConfirm,
  title,
  confirmText,
  cancelText,
  btnColor,
  inputValue,
  setInputValue,
}: ModalProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onCancel}>
      <ModalContainer>
        <PopupContainer>
          <FontText
            value={title}
            textSize="20px"
            textWeight="SemiBold"
            lineHeight="30px"
            textColor={COLOR.BASIC_BLACK}
          />
          {setInputValue && (
            <InputBox>
              <Input
                value={inputValue}
                onChangeText={setInputValue}
                fontSize="20px"
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={COLOR.GRAY_999}
                inputMode="email"
                maxLength={20}
                secureTextEntry
              />
            </InputBox>
          )}
          <View style={styles.buttonContainer}>
            <CancelButton onPress={onCancel} btnColor={btnColor}>
              <FontText
                value={cancelText}
                textSize="16px"
                textWeight="SemiBold"
                lineHeight="30px"
                textColor={COLOR.GRAY_999}
              />
            </CancelButton>
            {confirmText && onConfirm && (
              <DeleteButton onPress={onConfirm}>
                <FontText
                  value={confirmText}
                  textSize="16px"
                  textWeight="Bold"
                  lineHeight="30px"
                  textColor={COLOR.WHITE}
                />
              </DeleteButton>
            )}
          </View>
        </PopupContainer>
      </ModalContainer>
    </Modal>
  );
};
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
`;
const PopupContainer = styled.View`
  width: 350px;
  height: 160px;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
`;

const CancelButton = styled.Pressable<{ btnColor?: string }>`
  flex: 1;
  margin-right: 5px;
  background-color: ${({ btnColor }) => (btnColor ? btnColor : COLOR.WHITE)};
  border-width: ${({ btnColor }) => (btnColor ? '0px' : '1px')};
  border-color: ${({ btnColor }) => (btnColor ? 'transparent' : 'gray')};
  border-radius: 5px;
  padding: 10px;
  align-items: center;
`;

const DeleteButton = styled.Pressable`
  flex: 1;
  margin-left: 5px;
  background-color: ${COLOR.BASIC_BLACK};
  border-radius: 5px;
  padding: 10px;
  align-items: center;
`;
const InputBox = styled.Pressable`
  padding-vertical: 12px;
  padding-horizontal: 16px;
  margin-vertical: 7px;
  border-radius: 5px;
  background-color: ${COLOR.GRAY_F9};
`;
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default MyTabModal;
