export const carousel = () => {

const carousel = document.getElementById('imageCarousel');
    const images = carousel.getElementsByClassName('carousel-image');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const imageTitle = document.getElementById('imageTitle');
    const imageDescription = document.getElementById('imageDescription');
    const dotsContainer = document.getElementById('carouselDots');
    let currentIndex = 0;

    // Create dots
    for (let i = 0; i < images.length; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.addEventListener('click', () => showImage(i));
      dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.getElementsByClassName('dot');

    function showImage(index) {
      images[currentIndex].classList.remove('active');
      dots[currentIndex].classList.remove('active');
      currentIndex = (index + images.length) % images.length;
      images[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');
      
      imageTitle.textContent = images[currentIndex].dataset.title;
      imageDescription.textContent = images[currentIndex].dataset.description;
    }

    prevButton.addEventListener('click', (e) => {
      e.preventDefault();
      showImage(currentIndex - 1);
    });

    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      showImage(currentIndex + 1);
    });

    // Preload next image
    function preloadNextImage() {
      const nextIndex = (currentIndex + 1) % images.length;
      const nextImage = new Image();
      nextImage.src = images[nextIndex].src;
    }

    // Call preloadNextImage after each image change
    prevButton.addEventListener('click', preloadNextImage);
    nextButton.addEventListener('click', preloadNextImage);

    // Initial setup
    showImage(0);
    preloadNextImage();
  };