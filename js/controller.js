
// script1		
		{
			imagesLoaded(document.body, { background: true }, () => document.body.classList.remove('loading'));
			
			const menuItems = Array.from(document.querySelectorAll('.menu > .menu__item'));
			
			const piecesObj = new Pieces(document.querySelector('.slideshow > .pieces'), {
				pieces: {rows: 14, columns: 12},
				delay: [0,40],
				hasTilt: true,
				tilt: {
					maxRotationX: -1, 
					maxRotationY: -1, 
					maxTranslationX: -5, 
					maxTranslationY: -2
				}
			});
			
			let isAnimating = false;
			let current = 0;

			const openImage = (ev, item, pos) => {
				ev.preventDefault();
				if ( isAnimating || current === pos ) {
					return false;
				}
				isAnimating = true;
				menuItems[current].classList.remove('menu__item--current');
				current = pos;
				menuItems[current].classList.add('menu__item--current');
				const imgsrc = item.dataset.image;

				piecesObj.animate({
					duration: 200,
					easing: 'easeOutQuad',
					delay: (t,i,l) => {
						return parseInt(t.dataset.row) * parseInt(t.dataset.delay);
					},
					translateX: (t,i) => {
						return anime.random(-50,50)+'px';
					},
					translateY: (t,i) => { 
						return anime.random(-800,-200)+'px';
					},
					rotateZ: (t,i) => { 
						return anime.random(-45,45)+'deg';
					},
					opacity: 0,
					complete: () => {
						piecesObj.setImage(imgsrc);

						piecesObj.animate({
							duration: 500,
							easing: [0.3,1,0.3,1],
							delay: (t,i,l) => {
								return parseInt(t.dataset.row) * parseInt(t.dataset.delay);
							},
							translateX: 0,
							translateY: () => {
								return [anime.random(200,800)+'px','0px'];
							},
							rotateZ: 0,
							opacity: {
								value: 1,
								duration: 500,
								easing: 'linear'
							},
							complete: () => {
								isAnimating = false;
							}
						});
					}
				});
			};

			menuItems.forEach((item,pos) => item.addEventListener('click', (ev) => openImage(ev,item,pos)));
		}

// script2

		{
			imagesLoaded(document.body, { background: true }, () => document.body.classList.remove('loading'));

			const piecesEl = document.querySelector('.content1 .pieces');
			const piecesObj = new Pieces(piecesEl, {
				 pieces: {rows: 14, columns: 12}
			});
			const menuEl = document.querySelector('.page-nav');
			const optionsCtrl = document.querySelector('.content1__title');
			const closeOptionsCtrl = menuEl.querySelector('a.page-nav__item--close');

			const showOptions = () => {
				menuEl.classList.add('page-nav--open');

				piecesObj.animate({
					duration: 3000,
					delay: (t,i) => {
						const elBounds = piecesEl.getBoundingClientRect();
						const x1 = elBounds.left + elBounds.width/2;
						const y1 = elBounds.top + elBounds.height/2;
						const tBounds = t.getBoundingClientRect();
						const x2 = tBounds.left + tBounds.width/2;
						const y2 = tBounds.top + tBounds.height/2;
						const dist = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
						const maxDist = Math.sqrt(Math.pow(elBounds.left-x1,2) + Math.pow(elBounds.top-y1,2));
						const maxDelay = 300;

						t.dataset.centerx = x2;
						t.dataset.centery = y2;

						return -1*maxDelay/maxDist*dist + maxDelay;
					},
					easing: [0.1,1,0,1],
					translateX: (t,i) => { 
						return t.dataset.column < piecesObj.getTotalColumns()/2 ? anime.random(-400,0) : anime.random(0,400);
					},
					translateY: (t,i) => { 
						return t.dataset.row < piecesObj.getTotalRows()/2 ? anime.random(-400,0) : anime.random(0,400);
					},
					opacity: 0.2
				});
				
				anime.remove(optionsCtrl);
				anime({
					targets: optionsCtrl,
					duration: 700,
					easing: 'easeOutExpo',
					scale: 1.2,
					opacity: 0
				});

				anime.remove(menuEl);
				anime({
					targets: menuEl,
					duration: 700,
					delay: 150,
					easing: 'easeOutExpo',
					scale: [0,1],
					opacity: 1
				});
			};

			const hideOptions = (ev) => {
				ev.preventDefault();
				menuEl.classList.remove('page-nav--open');

				piecesObj.animate({
					duration: 600,
					delay: (t,i) => {
						const elBounds = piecesEl.getBoundingClientRect();
						const x1 = elBounds.left + elBounds.width/2;
						const y1 = elBounds.top + elBounds.height/2;
						const x2 = t.dataset.centerx;
						const y2 = t.dataset.centery;
						const dist = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
						const maxDist = Math.sqrt(Math.pow(elBounds.left-x1,2) + Math.pow(elBounds.top-y1,2));
						const maxDelay = 800;

						return maxDelay/maxDist*dist;
					},
					easing: [0.1,1,0,1],
					translateX: 0,
					translateY: 0,
					opacity: 1
				});
				
				anime.remove(optionsCtrl);
				anime({
					targets: optionsCtrl,
					duration: 700,
					delay: 200,
					easing: 'easeOutQuint',
					scale: [1.1,1],
					opacity: 1
				});

				anime.remove(menuEl);
				anime({
					targets: menuEl,
					duration: 700,
					easing: 'easeOutQuint',
					scale: 0.8,
					opacity: 0
				});
			};

			optionsCtrl.addEventListener('click', showOptions);
			closeOptionsCtrl.addEventListener('click', hideOptions);
		}

// script3

		{
			imagesLoaded(document.body, { background: true }, () => document.body.classList.remove('loading'));
			
			const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
			const galleryItems = Array.from(document.querySelectorAll('.gallery > .gallery__item'));
			const navItems = Array.from(document.querySelectorAll('.gallery-nav > .gallery-nav__item'));
			const piecesObjs = [];
			let current = 0;
			let isAnimating = false;
			let animateInTimeout;
			let fx = 0;

			galleryItems.forEach((item) => {
				piecesObjs.push(new Pieces(item, {
					pieces: {rows: 6, columns: 3},
					delay: [0,175]
				}));
			});

			navItems.forEach((navitem, pos) => {
				navitem.addEventListener('click', (ev) => navigate(ev, pos));
			});

			const navigate = (ev, pos) => {
				ev.preventDefault();
				if ( isAnimating || current === pos ) {
					return false;
				}
				isAnimating = true;
				
				navItems[current].classList.remove('gallery-nav__item--current');
				navItems[pos].classList.add('gallery-nav__item--current');

				piecesObjs[current].animate({
					duration: 800,
					easing: [0.2,1,0.3,1],
					delay: (t,i,l) => {
						if ( fx === 0 ) {
							return (l-i-1) + parseInt(t.dataset.delay);
						}
						else if ( fx === 1 ) {
							return parseInt(t.dataset.column) + parseInt(t.dataset.delay);
						}
						else {
							return (l-i-1)*20+getRandomInt(-30,30);
						}
					},
					translateX: (t,i) => {
						if ( fx === 0 ) {
							return t.dataset.column < piecesObjs[current].getTotalColumns()/2 ? anime.random(50,100)+'px' : anime.random(-100,-50)+'px';
						}
						else if ( fx === 1 ) {
							return pos > current ? anime.random(-1500,-1000)+'px' : anime.random(1000,1500)+'px';
						}
						else {
							return anime.random(-10,10)+'px';
						}
					},
					translateY: (t,i) => { 
						if ( fx === 0 ) {
							return anime.random(-1000,-800)+'px';
						}
						else if ( fx === 1 ) {
							return t.dataset.row < piecesObjs[current].getTotalRows()/2 ? anime.random(50,100)+'px' : anime.random(-100,-50)+'px';
						}
						else {
							return anime.random(-1000,-800)+'px';
						}
					},
					opacity: {
						value: 0,
						easing: 'linear'
					},
					complete: () => {
						galleryItems[current].classList.remove('gallery__item--current');
						current = pos;
						isAnimating = false;
					}
				});
				
				piecesObjs[pos].pieces.forEach((piece) => {
					piece.style.opacity = 0;

					if ( fx === 0 ) {
						piece.style.transform = `translateX(${piece.dataset.column > piecesObjs[pos].getTotalColumns()/2 ? anime.random(50,100) : anime.random(-100,-50)}px) translateY(${anime.random(800,1000)}px)`;
					}
					else if ( fx === 1 ) {
						piece.style.transform = `translateX(${pos > current ? anime.random(1000,1500) : anime.random(-1500,-1000)}px) translateY(${piece.dataset.row < piecesObjs[pos].getTotalRows()/2 ? anime.random(50,100) : anime.random(-100,-50)}px)`;
					}
					else {
						piece.style.transform = `translateX(${anime.random(-50,50)}px) translateY(${anime.random(-200,-100)}px)`;
					}
				});

				galleryItems[pos].style.opacity = 1;
				piecesObjs[pos].animate({
					duration: 800,
					easing: fx === 2 ? 'easeOutQuint' : 'easeInOutQuint',
					delay: (t,i,l) => {
						if ( fx === 0 ) {
							return i + parseInt(t.dataset.delay);
						}
						else if ( fx === 1 ) {
							return parseInt(t.dataset.column) + parseInt(t.dataset.delay);	
						}
						else {
							return (l-i-1)*40 + 150;
						}
					},
					translateX: 0,
					translateY: 0,
					rotateZ: () => {
						if ( fx === 0 ) {
							return [anime.random(-45,45),0];	
						}
						return 0;
					},
					opacity: 1,
					complete: () => {
						galleryItems[pos].classList.add('gallery__item--current');
					}
				});
			};

			const fxItems = Array.from(document.querySelectorAll('.switch > .switch__item'));
			fxItems.forEach((fxitem, pos) => {
				fxitem.addEventListener('click', (ev) => {
					if (fx === pos) return;
					fxItems[fx].classList.remove('switch__item--current');
					fx = pos;
					fxItems[fx].classList.add('switch__item--current');
				});
			});
		}

// script4

		{
			imagesLoaded(document.body, { background: true }, () => document.body.classList.remove('loading'));
			
			Array.from(document.querySelectorAll('.grid .pieces')).forEach((el,pos) => {
				const piecesObj = new Pieces(el, { 
					pieces: {rows: 10, columns: 8},
					delay: [0,25],
					bgimage: el.dataset.imageAlt
				});
				el.addEventListener('mouseenter', () => animateOut(piecesObj, pos));
				el.addEventListener('touchstart', () => animateOut(piecesObj, pos));
				el.addEventListener('mouseleave', () => animateIn(piecesObj, pos));
				el.addEventListener('touchend', () => animateOut(piecesObj, pos));
			});
			
			const animateOut = (instance,pos) => instance.animate({
				delay: (t,i,l) => {
					return parseInt(t.dataset.column)*parseInt(t.dataset.delay);
				},
				translateX: [
					{
						value: pos % 2 === 1 ? (t,i) => {
							return anime.random(75,150)+'px';
						} : (t,i) => {
							return anime.random(-150,-75)+'px';
						},
						duration: 500,
						easing: 'easeOutQuad'
					},
					{
						value: pos % 2 === 1 ? (t,i) => {
							return anime.random(-1000,-400)+'px';
						} : (t,i) => {
							return anime.random(400,1000)+'px';
						},
						duration: 400,
						easing: 'easeOutExpo'
					}
				],
				translateY: [
					{
						value: (t,i) => {
							return anime.random(-125,-75)+'px';
						},
						duration: 500,
						easing: 'easeOutQuad'
					},
					{
						value: (t,i) => {
							return t.dataset.row < instance.getTotalRows()/2 ? anime.random(100,200)+'px' : anime.random(-200,-100)+'px';
						},
						duration: 400,
						easing: 'easeOutExpo'
					}
				],
				opacity: {
					value: 0,
					delay: 500,
					duration: 400,
					easing: 'easeOutExpo'
				}
			});
			
			const animateIn = (instance,pos) => instance.animate({
				duration: 500,
				easing: [0.8,1,0.3,1],
				delay: (t,i) => {
					return pos % 2 === 1 ? 
						(instance.getTotalColumns() - parseInt(t.dataset.column)) * parseInt(t.dataset.delay) :
						parseInt(t.dataset.column) * parseInt(t.dataset.delay);
				},
				translateX: '0px',
				translateY: '0px',
				opacity: {
					value: 1,
					duration: 500,
					easing: 'linear'
				}
			});
		}
		