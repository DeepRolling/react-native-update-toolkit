import { customParser } from './parser';
import type { OriginXupdateInitialParams } from './information';
import { injectWholeXupdateParams } from './information';
import { InitArgs, XUpdate } from 'react-native-android-xupdate';

export const notInitializeError = new Error(
  'Find you not call useXupdateInitializer yet , please initialize xupdate first'
);

/**
 * you can call this function to inject service address and other information when xupdate init successful
 * @param params see {@link OriginXupdateInitialParams}
 */
function injectXupdateParams(params: OriginXupdateInitialParams) {
  injectWholeXupdateParams({
    ...params,
    updateServiceUrl: params.updateServiceHost + 'update/checkVersion',
  });
}

/**
 * call this function to init Xupdate framework
 * @param takeOverInitializeCallback if you pass this callback , you need manager initialize state by your self
 * so you can gain full control of initialize state
 */
function initXupdateFramework(
  takeOverInitializeCallback?: (success: boolean) => void
) {
  function initXUpdate() {
    ///设置初始化参数
    let args = new InitArgs();
    ///是否输出日志
    args.debug = true;
    //当前是post请求
    args.isPost = true;
    ///post请求是否是上传json
    args.isPostJson = false;
    ///是否只在wifi下才能进行更新
    args.isWifiOnly = false;
    ///是否开启自动模式
    args.isAutoMode = false;
    ///是否支持静默安装，这个需要设备有root权限
    args.supportSilentInstall = false;
    ///在下载过程中，如果点击了取消的话，是否弹出切换下载方式的重试提示弹窗
    args.enableRetry = true;

    ///初始化SDK
    XUpdate.init(args)
      .then((result: any) => {
        console.log('init successful : ' + JSON.stringify(result));
        takeOverInitializeCallback && takeOverInitializeCallback(true);
      })
      .catch((error: any) => {
        console.log('init error' + error);
        takeOverInitializeCallback && takeOverInitializeCallback(false);
      });

    //设置自定义解析
    XUpdate.setCustomParser({ parseJson: customParser });
  }
  //initialize update
  initXUpdate();
}

export { injectXupdateParams, initXupdateFramework };
