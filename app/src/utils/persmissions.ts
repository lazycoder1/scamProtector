import { Platform, PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestCallPermissions = async () => {
  if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.CONTACTS);
    console.log('Call history permission result:', result);
  } else {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG
    );
    console.log('Call history permission result:', result);
  }
};