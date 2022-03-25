import { xupdateInitParamsRef } from './information';
import { notInitializeError } from './initializer';
import type { UpdateEntity } from 'react-native-android-xupdate';

export enum UpdateStateType {
  /**
   * no update version
   */
  NO_NEW_VERSION = 0,

  /**
   * have update version but not is force update
   */
  HAVE_NEW_VERSION = 1,
  /**
   * have update version and this version is force update
   */
  HAVE_NEW_VERSION_FORCE_UPDATE = 2,
}

/**
 * parse json data to useful information
 * @param json data fetched from xupdate service
 */
export const customParser = (json: any) => {
  /**
   * backend result name of apk file , use this function generate entire url
   * @param downloadUrl
   */
  function generateUpdateApplicationDownloadUrl(downloadUrl: string) {
    if (xupdateInitParamsRef === null) {
      throw notInitializeError;
    }
    return xupdateInitParamsRef.updateServiceHost + 'update/apk/' + downloadUrl;
  }

  let appInfo = JSON.parse(json);
  console.log(
    'receive application update information : ' + JSON.stringify(appInfo.data),
  );
  if (
    appInfo.data['updateStatus'] === UpdateStateType.NO_NEW_VERSION.valueOf()
  ) {
    return {
      //必填
      hasUpdate: false,
      versionCode: 999,
      versionName: 'fuck the update',
      updateContent:
        'fuck the update , because he force me fill these content.',
      downloadUrl: 'fuck the update apk',
    } as UpdateEntity;
  }
  //if state have version , represent should update
  let hasUpdate =
    appInfo.data['updateStatus'] !== UpdateStateType.NO_NEW_VERSION.valueOf();
  let isForce =
    appInfo.data['updateStatus'] ===
    UpdateStateType.HAVE_NEW_VERSION_FORCE_UPDATE.valueOf();
  //always disable ignore feature , because if ignore the version ,  check update will not trigger window display
  let isIgnorable = false;
  let versionCode = appInfo.data['versionCode'];
  let versionName = appInfo.data['versionName'];
  let updateContent = appInfo.data['modifyContent'].replace(
    '\\\\r\\\\n',
    '\r\n',
  );
  let downloadUrl = appInfo.data['downloadUrl'];
  let apkSize = appInfo.data['apkSize'];
  let apkMd5 = appInfo.data['apkMd5'];

  return {
    //必填
    hasUpdate: hasUpdate,
    versionCode: versionCode,
    versionName: versionName,
    updateContent: updateContent,
    downloadUrl: generateUpdateApplicationDownloadUrl(downloadUrl),
    //选填
    isForce: isForce,
    isIgnorable: isIgnorable,
    apkSize: apkSize,
    apkMd5: apkMd5,
  } as UpdateEntity;
};
