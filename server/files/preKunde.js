document.addEventListener('DOMContentLoaded', function() {
    const signinButton = document.querySelector('.signin');
    let isTouchingButton = false;
    let isWithinButton = false;
    const signoutButton = document.querySelector('.signout');

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
                // Navigate to the link
                window.location.href = this.getAttribute('data-href');
            }
            isTouchingButton = false;
            isWithinButton = false;
            this.classList.remove('active-touch');
            e.preventDefault();
        });

        // Signout button touch events
        signoutButton.addEventListener('touchstart', function(e) {
            isTouchingButton = true;
            isWithinButton = true;
            this.classList.add('active-touch');
            e.preventDefault(); // Prevent default touch behavior
        });

        signoutButton.addEventListener('touchmove', function(e) {
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
        
        signoutButton.addEventListener('touchend', function(e) {
            console.log('someting');
            if (isWithinButton && isTouchingButton) {
                // Navigate to the link
                window.location.href = this.getAttribute('data-href2');
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

        // Signout button mouse events
        signoutButton.addEventListener('mousedown', function() {
            this.classList.add('active-touch');
        });

        signoutButton.addEventListener('mouseleave', function() {
            this.classList.remove('active-touch');
        });
    }
});