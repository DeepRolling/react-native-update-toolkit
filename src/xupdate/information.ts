// @ts-ignore
import type { UpdateArgs } from 'dianvo-native-android-xupdate/src';

export type OriginXupdateInitialParams = {
  applicationId: string; //android applicationId config in  build.gradle
  versionName: string; //android versionName(1.0.0) config in  build.gradle
  updateServiceHost: string; //address of machine deploy xupdate service (such as 'http://192.168.1.197:1111/')
  updateArgs?: UpdateArgs; //see xupdate document{@link https://github.com/xuexiangjys/react-native-xupdate} , if not supply , use default value
};

export type XUpdateInitialParamsWithUpdateServiceUrl =
  OriginXupdateInitialParams & {
    updateServiceUrl: string; //can be calculate by updateServiceHost
  };

let xupdateInitParamsRef: XUpdateInitialParamsWithUpdateServiceUrl | null =
  null;

function injectWholeXupdateParams(params: XUpdateInitialParamsWithUpdateServiceUrl) {
  xupdateInitParamsRef = params;
}

export { xupdateInitParamsRef, injectWholeXupdateParams };
