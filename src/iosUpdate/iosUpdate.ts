/**
 * result information of ios update check
 */
export type IosUpdateCheckResult = {
  shouldUpdate: boolean;
  version?: string;
  releaseNote?: string;
  trackViewUrl?: string;
};

/**
 * determine whether the application need update or not
 * @param localVersion current version of application
 * @param serviceVersion newest version from remote service
 */
const isUpdate = (localVersion: string, serviceVersion: string) => {
  let arr1 = localVersion.split('.');
  let arr2 = serviceVersion.split('.');
  for (let i = 0; i < arr1.length; ) {
    if (arr1[i] === arr2[i]) {
      i++;
    } else {
      return arr1[i] < arr2[i];
    }
  }
  return false;
};

export type IosCheckUpdateParams = {
  /**
   * ios application unique identification
   */
  iosBundleId: string;
  /**
   * current version of your application
   */
  iosVersion: string;
};

/**
 * you can call this function to check ios update
 * @param params see {@link IosCheckUpdateParams}
 */
export const checkIosUpdate = (params: IosCheckUpdateParams) => {
  const { iosBundleId, iosVersion } = params;
  return new Promise<IosUpdateCheckResult>((resolve, reject) => {
    fetch(`https://itunes.apple.com/lookup?bundleId=${iosBundleId}`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.results[0].version, '苹果应用商店版本');
        console.log('设备版本:', iosVersion);
        console.log(
          responseJson.results[0].trackViewUrl,
          '苹果应用商店的下载地址'
        );
        // let version1 = '1.0.0';//for test
        let serviceVersion = responseJson.results[0].version;
        let shouldUpdate = isUpdate(iosVersion, serviceVersion);
        console.log('版本对比', isUpdate);
        //get release note
        const releaseNote = responseJson.results[0].releaseNotes;
        const trackViewUrl = responseJson.results[0].trackViewUrl;
        resolve({
          shouldUpdate: shouldUpdate,
          version: serviceVersion,
          releaseNote: releaseNote,
          trackViewUrl: trackViewUrl,
        });
      })
      .catch(reject);
  });
};
