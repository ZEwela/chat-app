import { Audio } from "expo-av";

export const getStartRecording = async (setRecording) => {
  try {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    setRecording(recording);
  } catch (err) {
    console.error("Failed to start recording", err);
  }
};
