import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

// TODO 6: Capture the room and open the share sheet.
//
// Outcome: captureAndShare(viewRef, caption) takes a PNG picture of the view in viewRef (a React ref to the camera and
// 3D layers together), opens the phone's share sheet with that image and the caption as its title, and
// resolves { shared: true }. If sharing is not available on this device it captures nothing and resolves
// { shared: false, reason }. If anything throws, it resolves { shared: false, reason } with the error's
// message: it never throws itself.
// Verify:  tap Share in the room: the sheet opens with a picture of your room. In airplane mode the sheet still opens.
// Cover the camera lens: the picture shows what the screen shows, which proves it is the screen capture.
// Reflect (in your Notes doc): the share sheet reports no result to the app. What can your app claim after it closes?
//
// Your code below ↓
export async function captureAndShare(viewRef, caption) {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return { shared: false, reason: 'Sharing is not available on this device.' };
    }

    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
    });

    await Sharing.shareAsync(uri, {
      dialogTitle: caption,
      mimeType: 'image/png',
      UTI: 'public.png',
    });

    return { shared: true };
  } catch (error) {
    return { shared: false, reason: error?.message || String(error) };
  }
}
