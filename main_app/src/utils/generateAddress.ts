import AsyncStorage from '@react-native-async-storage/async-storage';

export const generateAddr = (): string => {
  const characters = 'abcdef0123456789';
  let result = '0x';
  for (let i = 0; i < 40; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const getUniqueHash = async (): Promise<string> => {
  try {
    let hash = await AsyncStorage.getItem('uniqueAppHash');
    if (!hash) {
      hash = generateAddr();
      await AsyncStorage.setItem('uniqueAppHash', hash);
    }
    return hash;
  } catch (e) {
    console.error('Failed to get/set unique hash', e);
    return generateAddr(); // Fallback to generating a new address if storage fails
  }
};