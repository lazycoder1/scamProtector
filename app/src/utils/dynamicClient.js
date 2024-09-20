import { createClient } from '@dynamic-labs/client';
import { ReactNativeExtension } from '@dynamic-labs/react-native-extension';

export const dynamicClient = createClient({
  environmentId: 'ef7b780d-4fa6-4324-9ad3-05f345c0c617',
}).extend(ReactNativeExtension())
