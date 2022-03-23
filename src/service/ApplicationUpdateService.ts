import {
  injectXupdateParams,
  initXupdateFramework,
} from '../xupdate/initializer';
import type { OriginXupdateInitialParams } from '../xupdate/information';
import {
  displayUpdateDialogIfHaveUpdate,
  queryHasUpdate,
  injectNoUpdateListener,
} from '../xupdate/operate';
import {
  IosCheckUpdateParams,
  IosUpdateCheckResult,
  checkIosUpdate,
} from '../iosUpdate/iosUpdate';

/**
 * this service include generic logic about application update for your application
 * include following feature :
 *
 */
class ApplicationUpdateService {
  isAndroid: boolean;
  iosInformation: IosCheckUpdateParams;
  xupdateInformation: OriginXupdateInitialParams;

  /**
   * inject all configuration information when create service
   * @param isAndroid is current application run in Android device
   * @param iosInformation ios application information
   * @param xupdateInformation xupdate initialize params
   */
  constructor(
    isAndroid: boolean,
    iosInformation: IosCheckUpdateParams,
    xupdateInformation: OriginXupdateInitialParams
  ) {
    this.isAndroid = isAndroid;
    this.iosInformation = iosInformation;
    this.xupdateInformation = xupdateInformation;
  }
  /**
   * ios not have frameworks need initialize
   * and you should use {@link registerCodePushWrapperWith} manually
   * speaking generally , this function response for init xupdate framework and trigger codepush check
   */
  initApplicationService() {
    if (this.isAndroid) {
      initXupdateFramework((success) => {
        if (success) {
          injectXupdateParams(this.xupdateInformation);
        }
      });
    }
  }

  /**
   * check application update , if have newer version ,
   * android will popup a dialog automatically
   * you need implement ios update dialog by your self
   * as normal , you should call this function when user enter home screen or user click update button manually
   * @param purpose where you use this functionality , we will offer more precise debug information for you
   * @param whenHaveUpdate action when there have newer version for ios ( android will pop-up dialog automaticlly)
   * @param whenNotHaveUpdate action when there not have newer version
   */
  checkApplicationUpdate(
    purpose: string,
    whenHaveUpdate: (result: IosUpdateCheckResult) => void,
    whenNotHaveUpdate: () => void
  ) {
    if (this.isAndroid) {
      injectNoUpdateListener(purpose, () => {
        whenNotHaveUpdate();
      });
      displayUpdateDialogIfHaveUpdate();
    } else {
      checkIosUpdate(this.iosInformation)
        .then((result) => {
          whenHaveUpdate(result);
        })
        .catch(() => {
          whenNotHaveUpdate();
        });
    }
  }

  /**
   * look remote service if have newer version of application
   * as normal , you should call this function to display a red point to notice user there have update
   * @param whenHaveUpdate action when there have newer version for both platform
   * @param whenNotHaveUpdate action when there not have newer version
   * @param whenServiceNotAvailable when xupdate service or ios store interface broken , this callback will be executed
   */
  lookIfHaveNewerVersion(
    whenHaveUpdate: () => void,
    whenNotHaveUpdate: () => void,
    whenServiceNotAvailable: (error: any) => void
  ) {
    if (this.isAndroid) {
      injectNoUpdateListener('', () => {
        whenNotHaveUpdate();
      });
      queryHasUpdate()
        .then((hasUpdate) => {
          if (hasUpdate) {
            whenHaveUpdate();
          }
        })
        .catch(whenServiceNotAvailable);
    } else {
      checkIosUpdate(this.iosInformation)
        .then((result) => {
          if (result.shouldUpdate) {
            whenHaveUpdate();
          } else {
            whenNotHaveUpdate();
          }
        })
        .catch(whenServiceNotAvailable);
    }
  }
}

export { ApplicationUpdateService };
