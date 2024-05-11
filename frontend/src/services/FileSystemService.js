import * as FileSystem from 'expo-file-system';
import general from '../assets/icons/general.png';
import storage from '@react-native-firebase/storage';

export async function getSymbolsToStorage() {
  const iconFirebaseFolderPath = 'icons';
  const iconStorageFolderPath = FileSystem.documentDirectory + iconFirebaseFolderPath;

  async function listFilesAndDirectories(reference) {
    let pageToken = undefined;
    const iconPaths = []
    do {
      let result = await reference.list({ pageToken });
      result.items.forEach(ref => iconPaths.push(ref.fullPath));
      pageToken = result.nextPageToken;
    } while (pageToken);
    return iconPaths;
  }

  async function getDownloadURL(filePaths) {
    const fileURL = [];
    for (const filePath of filePaths) {
      const downloadURL = await storage().ref(filePath).getDownloadURL();
      fileURL.push(downloadURL);
    }
    return fileURL;
  }

  const dirInfo = await FileSystem.getInfoAsync(iconStorageFolderPath);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(iconStorageFolderPath, { intermediates: true });
  }

  const reference = storage().ref(iconFirebaseFolderPath);

  const filePaths = await listFilesAndDirectories(reference);
  const fileURLs = await getDownloadURL(filePaths);

  for (i = 0; i < fileURLs.length; ++i) {
    const downloadFile = FileSystem.createDownloadResumable(fileURLs[i], FileSystem.documentDirectory + filePaths[i], {});
    await downloadFile.downloadAsync();
  }
}

export function getFileURI(file) {
  const dir = FileSystem.documentDirectory;
  const uri = dir + file;
  return uri;
}

export async function getFileIconURI(file) {
  if (file === '') {
    return general;
  }
  const uri = getFileURI(file);
  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    return uri;
  }
  return general;
}
