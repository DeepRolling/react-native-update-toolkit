export {
  registerCodePushWrapperWith,
  syncWithCodePush,
} from './codepush/codepushHook';

export {
  checkIosUpdate,
  IosUpdateCheckResult,
  IosCheckUpdateParams,
} from './iosUpdate/iosUpdate';

export {
  injectXupdateParams,
  initXupdateFramework,
} from './xupdate/initializer';

export {
  displayUpdateDialogIfHaveUpdate,
  queryHasUpdate,
} from './xupdate/operate';

export { ApplicationUpdateService } from './service/ApplicationUpdateService';
