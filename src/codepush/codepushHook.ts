import codePush from 'react-native-code-push';

/**
 * 配置 CodePush 为手动检查更新
 */
const codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

/**
 * you should wrapper your intro component with this function
 * @param component
 */
export function registerCodePushWrapperWith(component: any) {
  return codePush(codePushOptions)(component);
}

/**
 * you can call this function to check if there have any update in CodePush server and download it
 * downloaded bundle will be auto-install when you launch application next time
 */
export function syncWithCodePush() {
  codePush
    .sync({
      installMode: codePush.InstallMode.ON_NEXT_RESTART,
    })
    .then((value) => {
      console.log('code push sync state : ' + value.valueOf());
    });
}
