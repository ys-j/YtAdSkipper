'use strict';
const RATE = 16, INTERVAL = 500;
const adClasses = ['ad-showing', 'ad-interrupting'];
const defaultConfig = {
	'yt-player-playback-rate': { data: '1' },
	'yt-player-volume': { data: { volume: 100, muted: false } },
};
/** @param {string} key */
const getConfig = key => JSON.parse(sessionStorage.getItem(key) || '') || defaultConfig[key];

let b = /** @type {HTMLButtonElement?} */ (null);
const po = new MutationObserver(records => {
	for (const r of records) {
		const t = /** @type {?HTMLElement} */ (r.target);
		const v = t?.querySelector('video');
		if (t && v) {
			const isAd = adClasses.map(c => t.classList.contains(c)).includes(true);
			const wasAd = adClasses.map(c => r.oldValue?.includes(c)).includes(true);
			if (isAd) {
				v.playbackRate = RATE;
				v.muted = true;
			} else if (!isAd && wasAd) {
				/** @type {typeof defaultConfig['yt-player-playback-rate']} */
				const playbackRate = getConfig('yt-player-playback-rate');
				/** @type {typeof defaultConfig['yt-player-volume']} */
				const volume = getConfig('yt-player-volume');
				v.playbackRate = Number.parseFloat(playbackRate.data) || 1;
				v.muted = volume.data.muted;
			}
			b = t.querySelector('button.ytp-skip-ad-button') || t.querySelector('button.ytp-ad-skip-button-modern');
			if (b && b.style.display !== 'none') b.click();
		}
	}
});
(function main() {
	const p = document.getElementById('movie_player');
	if (p) {
		po.observe(p, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
		b = p.querySelector('button.ytp-skip-ad-button') || p.querySelector('button.ytp-ad-skip-button-modern');
	} else {
		setTimeout(main, INTERVAL);
	}
})();