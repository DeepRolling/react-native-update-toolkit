// @ts-ignore
import { UpdateArgs, XUpdate } from 'dianvo-native-android-xupdate/src';
import { xupdateInitParamsRef } from './information';
import { notInitializeError } from './initializer';
import { customParser } from './parser';

/**
 * query whether this application have new version
 * this operation not execute by xupdate framework , so the Error listener will never be triggered
 */
export async function queryHasUpdate() {
  const params = xupdateInitParamsRef;
  if (params === null) {
    throw Error('not initialize xupdate yet!!!!');
  }
  return new Promise<boolean>((resolve, reject) => {
    const details: { [index: string]: any } = {
      appKey: params.applicationId,
      versionCode: Number(params.versionName.split('.').join('')),
    };
    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + '=' + encodeURIComponent(details[key])
      )
      .join('&');
    fetch(params.updateServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(customParser(JSON.stringify(responseJson)).hasUpdate);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * call this function to launch check update process
 * if have newer version in service , the application will display dialog to let user update
 * if you want to deal the circumstance that not have newer version in service , call {@link injectNoUpdateListener}
 */
export function displayUpdateDialogIfHaveUpdate() {
  const params = xupdateInitParamsRef;
  if (params === null) {
    throw notInitializeError;
  }
  let args = new UpdateArgs(params.updateServiceUrl);
  args.isCustomParse =
    params.updateArgs?.isCustomParse === undefined
      ? true
      : params.updateArgs.isCustomParse;
  args.themeColor =
    params.updateArgs?.themeColor === undefined
      ? '#0FB4CF'
      : params.updateArgs.themeColor;
  args.buttonTextColor =
    params.updateArgs?.buttonTextColor === undefined
      ? '#FFFFFF'
      : params.updateArgs.buttonTextColor;
  args.topImageRes =
    params.updateArgs?.topImageRes === undefined
      ? 'xupdate_background_top'
      : params.updateArgs.topImageRes;
  args.widthRatio =
    params.updateArgs?.topImageRes === undefined
      ? 0.8
      : params.updateArgs.topImageRes;
  console.log('xupdate request params : ' + JSON.stringify(args));
  XUpdate.update(args);
}

export type ErrorListener = (message: string) => void;
const errorListenerMap: Map<string, ErrorListener> = new Map();

/**
 * in some circumstance , you may want to notice user there not have an update
 * you can use this method to inject a listener.
 * notice : listener only can be use once
 * @param purpose why you want to listen the no-update-error
 * @param listener action will be execute when there not have update in server
 */
export function injectNoUpdateListener(
  purpose: string,
  listener: ErrorListener
) {
  errorListenerMap.set(purpose, listener);
}

/**
 * listen only the situation not have update in server
 */
XUpdate.addErrorListener((result: any) => {
  console.log('xupdate error : ' + JSON.stringify(result));
  //2004 represent not have update in server ,see https://github.com/xuexiangjys/XUpdate/blob/master/xupdate-lib/src/main/java/com/xuexiang/xupdate/entity/UpdateError.java
  if (result.code && result.code === 2004) {
    if (result.message) {
      for (let [purpose, listener] of errorListenerMap.entries()) {
        console.log('error open , call registered listener : ' + purpose);
        listener(result.message);
        //this callback can only use once
        errorListenerMap.delete(purpose);
      }
    }
  }
});
