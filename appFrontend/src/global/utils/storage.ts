import EncryptedStorage from 'react-native-encrypted-storage';

export const getEncryptedStorage = async (key: string) => {
  try {
    const data = await EncryptedStorage.getItem(key);
    return data ? JSON.parse(data) : data;
  } catch (error) {
    // debug
    console.error('Failed token get storage from sign-in feature');
    throw error;
  }
};

export const setEncryptedStorage = async <T>(key: string, data: T) => {
  try {
    const jsonData = JSON.stringify(data);
    await EncryptedStorage.setItem(key, jsonData);
  } catch (error) {
    // debug
    console.error('Failed token set storage from sign-in response');
    throw error;
  }
};

export const removeEncryptedStorage = async (key: string) => {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    // debug
    console.error('Failed token set storage from sign-in response');
    throw error;
  }
};
