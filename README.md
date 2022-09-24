# KWebBrew
(<strong>K</strong>·Web·Brew)
<br/>
Kindle Web-Based HomeBrew Launcher

## What Is It?
The KWebBrew Launcher (Kindle Web-Based HomeBrew Launcher) allows people to code custom HTML webapps which are then stored locally on the Kindle itself, without the need for an internet connection!
<br/>
The KWebBrew Launcher acts as a launcher which automatically scans for apps, and then allows you to launch them
<br/>
The KWebBrew Launcher also comes with a few applications of its own, such as a read-only file manager 
<br/>
Lastly, the KWebBrew Launcher also comes with an API which other applications can use to read local files/directories 

## Installation
Coming Soon!

## How Does It Work?
Since the Kindle browser can access local files, and the fact that we know the mount path for USB, this means that the browser can load local HTML files!
<br/>
In fact, the browser itself can even bookmark these files for quick access.
<br/>
However, the browser does not support fetch or xmlhttprequests to get local files, luckily, I found a workaround by using iframes and getting their source. Additionally, the use of a polyfill allows apps using the KWebBrew API to use ES6 syntax in their apps, while the browser normally wouldn't support it

## Credits
Using custom polyfill from: [polyfill.io](https://polyfill.io) - MIT/CC0 Licenses
<br/>
Polyfill cache method from: [this issue](https://github.com/Financial-Times/polyfill-service/issues/2702)
<br/>
"Exploit" Discovery: [mobileread forums](https://www.mobileread.com/forums/showthread.php?t=45969) also [here](https://www.mobileread.com/forums/showthread.php?t=24127)
