# KWebBrew
![badge](https://img.shields.io/github/downloads/KWebBrew/KWebBrew/total?style=for-the-badge)

(<strong>K</strong>·Web·Brew)
<br/>
Kindle Web-Based HomeBrew Launcher

| ![KWebBrew](https://github.com/KindleModding/KWebBrew/assets/69104218/f970ef9c-8fb7-43b7-a041-9ca83bbe950e) | ![KChess](https://github.com/KindleModding/KWebBrew/assets/69104218/0ec92f53-0c6e-4431-b558-dd2d0412fc90) |
|------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|


## What Is It?
The KWebBrew Launcher (Kindle Web-Based HomeBrew Launcher) allows people to code custom HTML webapps which are then stored locally on the Kindle itself, without the need for an internet connection or jailbreak!
<br/>
The KWebBrew Launcher acts as a launcher which automatically scans for apps, and then allows you to launch them with ease
<br/>
The KWebBrew Launcher also comes with a few applications of its own, such as a read-only file manager (write filesystem access requires jailbreak, which is not the point of KWebBrew
<br/>
Lastly, the KWebBrew Launcher also comes with an API which other applications can use to read local files/directories as well as a polyfill including most standard ES6 features (see [Limitations](https://github.com/KWebBrew/KWebBrew/#Limitations))

## Compatability
KWebBrew works on firmwares <=5.16.3
It won't work on firmwares starting 5.16.4 because of the new Chromium browser that doesn't support the file:/// protocol.

## Installation
1. Download the [latest release](https://github.com/KWebBrew/KWebBrew/releases/latest) `KWebBrew.zip` file
2. Extract the zip file
3. Copy the `apps` and `kwebbrew` folders to the root of your Kindle
4. Copy the `.active_content_sandbox` folder to the root of your Kindle (note: this erases your web browser history and any custom bookmarks)
DONE!

## How To Use
KWebBrew automatically installs a bookmark for itself when copying the `.active_content_sandbox` folder, simply select this bookmark and it will open KWebBrew

KWebBrew also doesn't require an internet connection to function, simply open it and select an app

## How do I install apps?
Apps are HTML apps which are installed in the `apps` folder of your Kindle, they will appear on the launcher as shown in the images
To install an app, simply download it, and copy the folder to the `apps` folder
KWebBrew comes with a few proof-of-concept apps such as [Sudoku](https://www.mobileread.com/forums/showthread.php?p=4276488) (Created by [tesseractcat](https://www.mobileread.com/forums/member.php?u=282955) on the mobileread forums) or KChess (still a work in progress) and KCalc (a Kindle calculator)

## Info for developers
Please see the wiki (Work In Progress)

## How Does It Work?
Since the Kindle browser can access local files, and the fact that we know the mount path for USB, this means that the browser can load local HTML files!
<br/>
In fact, the browser itself can even bookmark these files for quick access.
<br/>
However, the browser does not support fetch or xmlhttprequests to get local files, luckily, I found a workaround by using iframes and getting their source. Additionally, the use of a polyfill allows apps using the KWebBrew API to use ES6 syntax in their apps, while the browser normally wouldn't support it

## Limitations
Note that whilst the polyfill works extremely well, there are some things that can't be replaced by a polyfill, for this reason the following features do not work:
- [Arrow Functions](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [Default Parameters](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Default_parameters)

If you find any unexpected behaviour, please open an issue

## Credits
Using custom polyfill from: [polyfill.io](https://polyfill.io) - MIT
<br/>
"Exploit" Discovery: [mobileread forums](https://www.mobileread.com/forums/showthread.php?t=45969) also [here](https://www.mobileread.com/forums/showthread.php?t=24127)
