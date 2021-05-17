/* ----------- navigation menu ---------- */
(() => {
    const hamburgerBtn = document.querySelector('.hamburger-btn'),
    navMenu = document.querySelector('.nav-menu'),
    closeNavBtn = navMenu.querySelector('.close-nav-menu');

    hamburgerBtn.addEventListener('click', showNavMenu);
    closeNavBtn.addEventListener('click', hideNavMenu);

    function showNavMenu() {
        navMenu.classList.add('open');
        bodyScrollingToggle();
    }
    function hideNavMenu() {
        navMenu.classList.remove('open');
        fadeOutEffect();
        bodyScrollingToggle();
    }

    function fadeOutEffect(){
        document.querySelector('.fade-out-effect').classList.add('active'); 
        setTimeout(() => {
            document.querySelector('.fade-out-effect').classList.remove('active'); 
        },300)  
    }
    // attach an event handler to document
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('link-item')) {
            // make sure event.target has a value before overrriding default
            if (event.target.hash !== '') {
                // prevent default anchor click behaviour
                event.preventDefault();
                const hash = event.target.hash;
                // deactivate exisitng active section
                document.querySelector('.section.active').classList.add('hide');
                document.querySelector('.section.active').classList.remove('active');

                // activate new section
                document.querySelector(hash).classList.add('active');
                document.querySelector(hash).classList.remove('hide');

                // deactivate existing active navigation menu 'link-item
                navMenu.querySelector('.active').classList.add('outer-shadow', 'hover-in-shadow');
                navMenu.querySelector('.active').classList.remove('active','inner-shadow');

                /* if clicked 'link-item' contained within nav-menu */ 
                if (navMenu.classList.contains('open')) {
                // activate navigation menu 'link-item'
                    event.target.classList.add('active', 'inner-shadow');
                    event.target.classList.remove('outer-shadow', 'hover-in-shadow');
                    // hide navigation menu
                    hideNavMenu();
                }
                else {
                    let navItems = navMenu.querySelectorAll('.link-item');
                    navItems.forEach((item) => {
                        if (hash === item.hash) {
                            item.classList.add('active', 'inner-shadow');
                            item.classList.remove('outer-shadow', 'hover-in-shadow');   
                        }
                    })
                    fadeOutEffect();
                }
                // add hash (0) to url
                window.location.hash = hash;
            }
        }
    })
})();

/* about section tabs */

(() => {
    const aboutSection = document.querySelector(".about-section"),
    tabsContainer = document.querySelector(".about-tabs");

    tabsContainer.addEventListener('click', (event) => {
        /* if event.target contain 'tab-item' class and not contain'active' class*/
        if (event.target.classList.contains("tab-item") && !event.target.classList.contains("active")){
            const target = event.target.getAttribute('data-target');
            //deactivate existing CTIVE 'TAB-ITEM
            tabsContainer.querySelector('.active').classList.remove('outer-shadow', 'active');
            // active new 'tab-item
            event.target.classList.add('active', 'outer-shadow');
            //deactive existing 'tab-content 
            aboutSection.querySelector('.tab-content.active').classList.remove('active');
            //activate new tab-content
            aboutSection.querySelector(target).classList.add('active');
        }
    })
})(); 


function bodyScrollingToggle() {
    document.body.classList.toggle('hidden-scrolling');
}
/* ---------- portfolio filter ajnd pop up  ---------*/
(() => {
    const filterContainer = document.querySelector('.portfolio-filter'),
    portfolioItemsContainer = document.querySelector('.portfolio-items'),
    portfolioItems = document.querySelectorAll('.portfolio-item')
    popup = document.querySelector('.portfolio-popup'),
    prevBtn = popup.querySelector('.pp-prev'),
    nextBtn = popup.querySelector('.pp-next'),
    closeBtn = popup.querySelector('.pp-close'),
    projectDetailsContainer = popup.querySelector('.pp-details');
    projectDetailsBtn = popup.querySelector('.pp-project-details-btn');

    let itemIndex, slideIndex, screenshots;
    /* filter portfolio items */
    
    filterContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('filter-item') && !event.target.classList.contains('active')) {
            // deactivate existing active 'filter-item 
            filterContainer.querySelector('.active').classList.remove('outer-shadow', 'active');
            // active new filter item
            event.target.classList.add('active', 'outer-shadow');
            const target = event.target.getAttribute('data-target');
            portfolioItems.forEach((item) => {
                if (target === item.getAttribute('data-category') || target === 'all') {
                    item.classList.remove('hide');
                    item.classList.add('show');
                }
                else{
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            })
        }
    })

    portfolioItemsContainer.addEventListener('click', (event) => {
        if (event.target.closest('.portfolio-item-inner')) {
            const portfolioItem = event.target.closest('.portfolio-item-inner').parentElement;
            // get the portfolio item index
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
            screenshots = portfolioItems[itemIndex].querySelector('.portfolio-item-img img').getAttribute('data-screenshots');
            
            // convert screenshots into array
            screenshots = screenshots.split(',');
            if (screenshots.length === 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
            else{
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            }
            slideIndex = 0
            popupToggle();
            popupSlideshow();
            popupDetails();
        }   
    })

    closeBtn.addEventListener('click', (event) => {
        popupToggle();
        if (projectDetailsContainer.classList.contains('active')) {
            popupDetailsToggle();
        }
    })
    function popupToggle() {
        popup.classList.toggle('open');
        bodyScrollingToggle();
    }

    function popupSlideshow() {
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector('.pp-img');
        // activate loader until popupImg load
        popup.querySelector('.pp-loader').classList.add('active');
        popupImg.src = imgSrc;

        popupImg.onload = () => {
            // deactivate loader after popupImg load
            popup.querySelector('.pp-loader').classList.remove('active');
        }
        popup.querySelector('.pp-counter').innerHTML = (slideIndex+1) + " of " + screenshots.length;
    }
    // next slide
    nextBtn.addEventListener('click', () => {
        if (slideIndex === screenshots.length - 1) {
            slideIndex = 0;
        }
        else {
            slideIndex++;
        }
        popupSlideshow();
    })

    function popupDetails() {
        // get the project details
        if (!portfolioItems[itemIndex].querySelector('.portfolio-item-details')) {
            projectDetailsBtn.style.display = 'none';
            return;
        }
        projectDetailsBtn.style.display = 'block';
        // set the project details
        const details = portfolioItems[itemIndex].querySelector('.portfolio-item-details').innerHTML;
        popup.querySelector('.pp-project-details').innerHTML = details;
        // set title
        const title = portfolioItems[itemIndex].querySelector('.portfolio-item-title').innerHTML;
        popup.querySelector('.pp-title h2').innerHTML = title;
        // set category
        const category = portfolioItems[itemIndex].getAttribute('data-category');
        popup.querySelector('.pp-project-category').innerHTML = category.split('-').join(' ');
    }
    //prev btn
    prevBtn.addEventListener('click', () => {
        if (slideIndex === 0) {
            slideIndex = screenshots.length - 1; 
        }
        else{
            slideIndex--;
        }
        popupSlideshow();
    })

    projectDetailsBtn.addEventListener('click', () => {
        popupDetailsToggle();
    })
    function popupDetailsToggle() {
        if (projectDetailsContainer.classList.contains('active')) {
            projectDetailsBtn.querySelector('i').classList.remove('fa-minus');
            projectDetailsBtn.querySelector('i').classList.add('fa-plus');

            projectDetailsContainer.classList.remove('active');
            projectDetailsContainer.style.maxHeight = 0 + 'px';
        }
        else {
            projectDetailsBtn.querySelector('i').classList.remove('fa-plus');
            projectDetailsBtn.querySelector('i').classList.add('fa-minus');

            projectDetailsContainer.classList.add('active');
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + 'px';
            popup.scrollTo(0, projectDetailsContainer.offsetTop);
        }
    }
})();

/*  ----- testimonial slider ---------*/
(() => {
    const sliderContainer = document.querySelector('.testi-slider-container'),
    slides = sliderContainer.querySelectorAll('.testi-item'),
    slideWidth = sliderContainer.offsetWidth,
    prevBtn = document.querySelector('.testi-slider-nav .prev'),
    nextBtn = document.querySelector('.testi-slider-nav .next'),
    activeSlide = sliderContainer.querySelector('.testi-item.active');
    let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);

    // set width of all slides
    slides.forEach((slide) => {
        slide.style.width = slideWidth + 'px';
    })

    // set width of sliderContainer
    sliderContainer.style.width = slideWidth * slides.length + 'px';
    nextBtn.addEventListener('click', () => {
        if (slideIndex === slides.length - 1) {
            slideIndex = 0;
        }
        else{
            slideIndex++;
        }
        slider();
    })

    prevBtn.addEventListener('click', () => {
        if (slideIndex === 0) {
            slideIndex = slides.length - 1;
        }
        else {
            slideIndex--;
        }
        slider();
    })

    function slider() {
        // deactivate existing active slide
        sliderContainer.querySelector('.testi-item.active').classList.remove(
            'active');
            // activate new slide
        slides[slideIndex].classList.add('active');
        sliderContainer.style.marginLeft = - ( slideWidth * slideIndex) + 'px';
    }
    slider();
})();

/*  hide all section except active */
(() => {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => {
        if (!section.classList.contains('active')) {
            section.classList.add('hide');
        }
    })
})(); 