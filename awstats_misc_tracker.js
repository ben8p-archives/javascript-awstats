(function(trackerUrl) {
	var USER_ID = 'AWSUSER_ID',
		SSESSION_ID = 'AWSSESSION_ID',
		DEFAULT_TRACKER = '/js/awstats_misc_tracker.js',
		getCookie = function(name) {
			if(document.cookie.length) {
				var begin = document.cookie.indexOf(name + '='),
					end;
				if(~begin) {
					begin += name.length + 1;
					end = document.cookie.indexOf(';', begin);
					if(!(~end)) {
						end = document.cookie.length;
					}
					return unescape(document.cookie.substring(begin, end));
				}
			}
			return null;
		},
		setCookie = function(name, value, expires) {
			if(expires) {
				var date = new Date();
				date.setTime(date.getTime() + (expires * 36e5));
				expires = '; expires=' + date.toGMTString();
			}
			document.cookie = [name, '=', escape(value), '; path=/', expires || ''].join('');
		},
		startup = function() {
			if(!window.location.search || window.location.search === '?') {
				var now = (new Date()).getTime(),
					screenSize = [screen.width, screen.height].join('x'),
					colorDepth = screen.pixelDepth || screen.colorDepth,
					hasJava = navigator.javaEnabled(),
					cacheBust = Math.floor(Math.random() * 1e4),
					userId = getCookie(USER_ID) || [USER_ID, now, 'r', cacheBust].join(''),
					sessionId = getCookie(SSESSION_ID) || [SSESSION_ID, now, 'r', cacheBust].join(''),
					appName = navigator.appName.toLowerCase(), // 'internet explorer' or 'netscape'
					userAgent = navigator.userAgent.toLowerCase(), // 'msie...', 'mozilla...', 'firefox...'
					isWindows = ~userAgent.indexOf('win') || ~userAgent.indexOf('32bit'),
					isMac = ~userAgent.indexOf('mac'),
					isNetscape = ~appName.indexOf('netscape'),
					isOpera = ~appName.indexOf('opera'),
					isIE = ~userAgent.indexOf('msie'),
					pageElement = document.documentElement || document.body,
					viewportSize = [pageElement.clientWidth || window.innerWidth, pageElement.clientHeight || window.innerHeight].join('x'),
					hasActiveX = isIE && isWindows && window.ActiveXObject,
					hasShockwave = false,
					hasAdobeSVGViewer = false,
					hasFlash = false,
					hasRealPlayer = false,
					hasQuicktime = false,
					hasWindowsMediaPlayer = false,
					hasPDF = false,
					realPlayerClass = [
						'rmocx.RealPlayer G2 Control',
						'rmocx.RealPlayer G2 Control.1',
						'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
						'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
						'RealPlayer'
					],
					pdfClass = [
						'AcroPDF.PDF',
						'AcroPDF.PDF.1',
						'PDF.PdfCtrl',
						'PDF.PdfCtrl.1',
						'PDF.PdfCtrl.5',
						'PDF.PdfCtrl.6'
					],
					iterator,
					pdfInstance = null,
					pluginList = {};

				setCookie(USER_ID, userId, 1e4);
				setCookie(SSESSION_ID, sessionId, 1);

				if(hasActiveX) {
					try { hasShockwave = !!(new window.ActiveXObject('SWCtl.SWCtl')); } catch(ignore) {}
					try { hasAdobeSVGViewer = !!(new window.ActiveXObject('Adobe.SVGCtl')); } catch(ignore) {}
					try { hasFlash = !!(new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash')); } catch(ignore) {}
					try { hasQuicktime = !!(new window.ActiveXObject('Quicktime.Quicktime')); } catch(ignore) {}
					try { hasWindowsMediaPlayer = !!(new window.ActiveXObject('wmplayer.ocx')); } catch(ignore) {}
					for(iterator = 0; iterator < realPlayerClass.length; iterator++) {
						try { hasRealPlayer = !!(new ActiveXObject(realPlayerClass[iterator])); } catch(ignore) { continue; }
						if(hasRealPlayer) { break; }
					}
					for(iterator = 0; iterator < pdfClass.length; iterator++) {
						try { hasPDF = !!(new ActiveXObject(pdfClass[iterator])); } catch(ignore) { continue; }
						if(hasPDF) { break; }
					}
				} else if(navigator.mimeTypes) {
					 hasShockwave = navigator.mimeTypes['application/x-director'] && navigator.mimeTypes['application/x-director'].enabledPlugin;
					 hasAdobeSVGViewer = document.implementation.hasFeature('org.w3c.dom.svg', '') || (navigator.mimeTypes['image/svg+xml'] && navigator.mimeTypes['image/svg+xml'].enabledPlugin);
					 hasFlash = navigator.mimeTypes['application/x-shockwave-flash'] && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin;
					 hasRealPlayer = navigator.mimeTypes['audio/x-pn-realaudio-plugin'] && navigator.mimeTypes['audio/x-pn-realaudio-plugin'].enabledPlugin;
					 hasQuicktime = navigator.mimeTypes['video/quicktime'] && navigator.mimeTypes['video/quicktime'].enabledPlugin;
					 hasWindowsMediaPlayer = navigator.mimeTypes['application/x-mplayer2'] && navigator.mimeTypes['application/x-mplayer2'].enabledPlugin;
					 hasPDF = navigator.mimeTypes['application/pdf'] && navigator.mimeTypes['application/pdf'].enabledPlugin;
				 }
				(new Image()).src = [
					trackerUrl || DEFAULT_TRACKER,
					'?screen=', screenSize,
					'&win=', viewportSize,
					'&cdi=', colorDepth,
					'&java=', hasJava,
					'&shk=', hasShockwave ? 'y' : 'n',
					'&svg=', hasAdobeSVGViewer ? 'y' : 'n',
					'&fla=', hasFlash ? 'y' : 'n',
					'&rp=', hasRealPlayer ? 'y' : 'n',
					'&mov=', hasQuicktime ? 'y' : 'n',
					'&wma=', hasWindowsMediaPlayer ? 'y' : 'n',
					'&pdf=', hasPDF ? 'y' : 'n',
					'&uid=', userId,
					'&sid=', sessionId
				].join('');
			}
		};

	startup();
})(/*Add here the url to the file tracker (likely this file)*/);
