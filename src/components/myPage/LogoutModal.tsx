import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { FontText } from '@/components/common/atoms';
import { COLOR } from '@/constants';

interface ModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onLogout: () => void;
}

const LogoutModal = ({ isVisible, onCancel, onLogout }: ModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.popupContainer}>
                    <FontText
                        value="로그아웃하시겠습니까?"
                        textSize="20px"
                        textWeight="SemiBold"
                        lineHeight="30px"
                        textColor={COLOR.BASIC_BLACK}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancel}
                        >
                            <FontText
                                value="취소"
                                textSize="16px"
                                textWeight="SemiBold"
                                lineHeight="30px"
                                textColor={COLOR.GRAY_999}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={onLogout}
                        >
                            <FontText
                                value="확인"
                                textSize="16px"
                                textWeight="Bold"
                                lineHeight="30px"
                                textColor={COLOR.WHITE}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    popupContainer: {
        width: 350,
        height: 160,
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        marginRight: 5,
        backgroundColor: COLOR.WHITE,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    deleteButton: {
        flex: 1,
        marginLeft: 5,
        backgroundColor: COLOR.BASIC_BLACK,
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },

});

export default LogoutModal;