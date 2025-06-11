const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.2
  });

  document.querySelectorAll('.futuristic-entrance').forEach(el => {
    observer.observe(el);
  });


const backgrounds = document.querySelectorAll('.hero-background');
  let index = 0;

  function changeBackground() {
    backgrounds[index].classList.remove('active');
    index = (index + 1) % backgrounds.length;
    backgrounds[index].classList.add('active');
  }

  setInterval(changeBackground, 5000);