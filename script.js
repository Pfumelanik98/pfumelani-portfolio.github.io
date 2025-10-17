document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('.nav a');
  links.forEach(a => {
	const href = a.getAttribute('href');
	// ensure href is a string we can safely call string methods on and ignore fragment-only links
	if (typeof href === 'string' && href.length > 0 && !href.startsWith('#')) {
	  if (location.pathname.endsWith(href) || (href === 'index.html' && location.pathname.endsWith('/'))) {
		a.classList.add('active');
	  }
	}
  });

  const thank = document.querySelector('.thank-you');
  if (thank) {
	setInterval(() => {
	  thank.style.transform = 'scale(1.02)';
	  setTimeout(() => {
		thank.style.transform = 'scale(1)';
	  }, 900);
	}, 3000);
  }
});