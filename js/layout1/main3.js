{
	const DOM = {};
	DOM.body = document.body;
	DOM.gridElems = Array.from(document.querySelectorAll('.grid'));
	
	imagesLoaded(DOM.body, {background: true} , () => {
		DOM.body.classList.remove('loading');
		new Slideshow(DOM.gridElems, {
			hasTilt: true,
			tilt: {maxTranslationX: 25, maxTranslationY: 25}
		});
	});
}