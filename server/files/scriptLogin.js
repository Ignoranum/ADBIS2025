document.addEventListener('DOMContentLoaded', function() {
  const signinButton = document.querySelector('button');
  let isTouchingButton = false;
  let isWithinButton = false;

  // Check if it's a touch device
  const isTouchDevice = 'ontouchstart' in window;

  // Set up event listeners based on device type
  if (isTouchDevice) {
      // Touch device events
      signinButton.addEventListener('touchstart', function(e) {
          isTouchingButton = true;
          isWithinButton = true;
          this.classList.add('active-touch');
          e.preventDefault(); // Prevent default touch behavior
      });

      signinButton.addEventListener('touchmove', function(e) {
          // Check if touch moved outside the button
          const touch = e.touches[0];
          const rect = this.getBoundingClientRect();
          isWithinButton = (
              touch.clientX >= rect.left &&
              touch.clientX <= rect.right &&
              touch.clientY >= rect.top &&
              touch.clientY <= rect.bottom
          );
          
          if (!isWithinButton) {
              this.classList.remove('active-touch');
          } else if (isTouchingButton) {
              this.classList.add('active-touch');
          }
      });

      signinButton.addEventListener('touchend', function(e) {
          if (isWithinButton && isTouchingButton) {
            // Submit the form
            document.querySelector('form').submit();
          } 
          isTouchingButton = false;
          isWithinButton = false;
          this.classList.remove('active-touch');
          e.preventDefault();
      });

  } else {
      // Mouse events for non-touch devices
      signinButton.addEventListener('mousedown', function() {
          this.classList.add('active-touch');
      });

      signinButton.addEventListener('mouseup', function() {
          this.classList.remove('active-touch');
          // Navigate to the link
          window.location.href = this.getAttribute('data-href');
      });

      signinButton.addEventListener('mouseleave', function() {
          this.classList.remove('active-touch');
      });

  }
});