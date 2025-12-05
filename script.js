'use strict';

// Tab Switching Functionality
document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');

      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      this.classList.add('active');
      const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      // Smooth scroll to top of content
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  // Smooth scrolling for internal links
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});