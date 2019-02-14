function convertToGenshijinLanguage(omaeSentence) {
	if (!omaeSentence) return;

	return fetch(`./ajax.json?omaeSentence=${encodeURIComponent(omaeSentence)}`)
		.then(res => res.text())
		.then((text) => {
			console.log(text);
			const genshijinSentence = JSON.parse(text).genshijinSentence;

			return genshijinSentence;
		});
}

(() => {
	const omaeSentenceArea = document.getElementById("js-omaeSentence");
	const genshijinSentenceArea = document.getElementById("js-genshijinSentence");
	const convertBtnArea = document.getElementById("js-convertBtn");
	const preloaderArea = document.getElementById("js-preloader");

	let omaeSentence = "";
	let omaeSentenceChanged = false;


	omaeSentenceArea.addEventListener("change", (event) => {
		omaeSentence = event.target.value;
		omaeSentenceChanged = true;
	});

	convertBtnArea.addEventListener("click", (event) => {
		if(!omaeSentenceChanged) return;

		preloaderArea.classList.add("active");

		convertToGenshijinLanguage(omaeSentence)
			.then((genshijinSentence) => {
				genshijinSentenceArea.value = genshijinSentence;
			}).finally(() => {
				preloaderArea.classList.remove("active");
			});

		omaeSentenceChanged = false;
	});
})();
