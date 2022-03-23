# react-native-update-toolkit

Integration of react-native application update functionality.

## Installation

```sh
yarn add react-native-update-toolkit
# this project depends on others two project, install them by command :
yarn add react-native-code-push dianvo-native-android-xupdate
```

## Usage

step1 : declare update service
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
