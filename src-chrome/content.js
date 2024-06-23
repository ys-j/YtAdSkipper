'use strict';
const RATE = 16, INTERVAL = 500, DELAY = 100;
const po = new MutationObserver(records => {
	for (const r of records) {
		const t = /** @type {?HTMLElement} */ (r.target);
		const v = t?.querySelector('video');
		if (t && v && r.attributeName === 'class') {
			const isAd = ['ad-showing', 'ad-interrupting'].map(c => t.classList.contains(c)).includes(true);
			setTimeout(() => {
				v.playbackRate = isAd ? RATE : 1;
				v.muted = isAd;
			}, DELAY);
			if (isAd) {
				const b = t.querySelector('button.ytp-skip-ad-button');
				if (b) bo.observe(b, { attributes: true });
			}
		}
	}
});
const bo = new MutationObserver(records => {
	for (const r of records) {
		const t = /** @type {?HTMLElement} */ (r.target);
		if (t && r.attributeName === 'style') {
			const isShown = t.style.display !== 'none';
			if (isShown) {
				t.click();
				bo.disconnect();
			}
		}
	}
});
(function main() {
	const p = document.getElementById('movie_player');
	if (p) {
		po.observe(p, { attributes: true });
	} else {
		setTimeout(main, INTERVAL);
	}
})();