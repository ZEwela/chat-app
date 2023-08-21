import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export const getStopRecording = async (
  recording,
  setRecordUri,
  setRecording
) => {
  await recording.stopAndUnloadAsync();
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
  });

  const recordingUri = recording.getURI();
  let fileName = `recording-${Date.now()}.caf`;

  await FileSystem.makeDirectoryAsync(
    FileSystem.documentDirectory + "recordings/",
    { intermediates: true }
  );

  let uriPlace = FileSystem.documentDirectory + "recordings/" + `${fileName}`;

  await FileSystem.moveAsync({
    from: recordingUri,
    to: uriPlace,
  });

  setRecordUri(uriPlace);
  setRecording(undefined);
};
