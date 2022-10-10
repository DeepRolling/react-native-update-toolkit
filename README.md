# react-native-update-toolkit

This library used to implement update functionality in react-native application.

In Android side, I use codepush and xpdate to get things work.

In IOS side, things become complicated, there not have a method to just download install package and notice user
override the old application as they do in Android side. Due to user only can update application from App Store.

So I offer a function to check if there have newer version in App Store, so you need implement your own notice
window(or other manner) and bridge it with update lint hook which provided by this library.

## Installation

This toolkit depends on some libraries. So you need install them first :
```shell
yarn add react-native-code-push react-native-android-xupdate react-native-update-toolkit
```
> Notice : official react-native-code-push library call some function during initialize which will violate
> the privacy rules enacted by application store. So I make a patch to solve this problem, you can use following
> package :
>
> "react-native-code-push": "git+ssh://git@gitee.com:deepcodestudio/gitpkg-repository.git#react-native-code-push-v7.0.5-gitpkg-fix"

After that, you also need some steps to reach the end point.

[config react-native-code-push in android side](https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-native-060-version-and-above-android)

[How to change background of xupdate update notice window](https://github.com/xuexiangjys/react-native-xupdate)

## Usage

step1 : declare update service·
```typescript
import {ApplicationUpdateService} from 'react-native-update-toolkit';
import {isAndroid} from 'react-native-deepcode-toolkit/src/utils/ui/systemSpec';
import DeviceInfo from 'react-native-device-info';
import {debug} from '@config/index';

export const updateService = new ApplicationUpdateService(
    isAndroid,
    {
        iosBundleId: DeviceInfo.getBundleId(),
        iosVersion: DeviceInfo.getVersion(),
    },
    {
        updateServiceHost: debug ? 'http://192.168.1.197:1111/' : 'http://xp.finsiot.com:1111/',
        applicationId: DeviceInfo.getBundleId(),
        versionName: DeviceInfo.getVersion(),
        updateArgs: {
            themeColor: 'purple',
            buttonTextColor: '#FFFFFF',
        },
    },
);

```

step2 : initialize update service in entry of your application
```typescript
  useEffect(() => {
        //xupdate initializer(codepush + xupdate in android platform)
        updateService.initApplicationService();
        if (isAndroid) {
            syncWithCodePush();
        }
        //change state bar
        StatusBar.setBarStyle('dark-content');
    }, []);
```

step3 : check if have new version in Home screen or whereever you want to check

> The update-window will pop-up if there have newer version in android platform,
but you need _**display update-window by your self in ios platform**_
```typescript
 //region when launch home screen , check android and ios native update
 const [displayIosUpdateWindow, setDisplayIosUpdateWindow] = useState<IosUpdateCheckResult>({
     shouldUpdate: false,
 });
 useEffect(() => {
     updateService.checkApplicationUpdate(
         'homeScreenCheck',
         result => {
             setDisplayIosUpdateWindow(result);
         },
         () => {
             //check update silently , so don't notice user not have update
         },
     );
 }, []);
 //endregion
```

you can also check if there have newer version use standalone function, it's useful when you need
display red point indicate if there have a version can be updated!
```typescript
const [hasUpdate, setHasUpdate] = useState<boolean>(false);
    useEffect(() => {
        updateService.lookIfHaveNewerVersion(
            () => {
                setHasUpdate(true);
            },
            () => {
                //not have update
                //check update silently , so don't notice user not have update
            },
            () => {
              //service not avaliable, you can log it or do nothing
            },
        );
    }, []);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
