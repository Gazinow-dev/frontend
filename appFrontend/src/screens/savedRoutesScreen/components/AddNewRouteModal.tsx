import React, { useState } from 'react';
import { Modal } from 'react-native';
import AddNewRouteHeader from './AddNewRouteHeader';
import NewSearchSwapStation, { SelectedStationTypes } from './NewSearchSwapStation';
import SelectNewRouteModal from './SelectNewRouteModal';
import NameNewRouteModal from './NameNewRouteModal';
import NewRouteDetailModal from './NewRouteDetailModal';
import { Path } from '@/global/apis/entity';

interface ModalProps {
  isVisible: boolean;
  onCancel: () => void;
}

const AddNewRouteModal = ({ isVisible, onCancel }: ModalProps) => {
  // 선택한 경로 값을 갖고서 경로 선택하는 컴포넌트로 상태 전달하기
  const [seletedStation, setSeletedStation] = useState<SelectedStationTypes>({
    arrival: {
      stationName: '',
      stationLine: null,
    },
    departure: {
      stationName: '',
      stationLine: null,
    },
  });
  const [selectedRoutePath, setSelectedRoutePath] = useState<Path | null>(null);

  const [depth, setDepth] = useState<'search' | 'pathList' | 'detail' | 'name'>('search');
  const onBackBtnPress = () => {
    switch (depth) {
      case 'search':
        return onCancel();
      case 'pathList':
        setDepth('search');
        return onCancel();
      case 'detail':
        return setDepth('pathList');
      case 'name':
        return setDepth('pathList');
    }
  };
  const onCloseBtnPress = () => {
    onCancel();
    setDepth('search');
  };

  return (
    <Modal visible={isVisible} onRequestClose={onBackBtnPress}>
      <AddNewRouteHeader onBackBtnPress={onBackBtnPress} onCloseBtnPress={onCloseBtnPress} />
      {(depth === 'search' || depth === 'pathList') && (
        <NewSearchSwapStation setDepth={setDepth} setSeletedStation={setSeletedStation} />
      )}
      {depth === 'pathList' && (
        <SelectNewRouteModal
          setDepth={setDepth}
          seletedStation={seletedStation}
          selectedRoutePath={selectedRoutePath}
          setSelectedRoutePath={setSelectedRoutePath}
        />
      )}
      {selectedRoutePath && depth === 'detail' && (
        <NewRouteDetailModal item={selectedRoutePath} setDepth={setDepth} />
      )}
      {selectedRoutePath && depth === 'name' && (
        <NameNewRouteModal onCancel={onCancel} setDepth={setDepth} item={selectedRoutePath} />
      )}
    </Modal>
  );
};

export default AddNewRouteModal;
