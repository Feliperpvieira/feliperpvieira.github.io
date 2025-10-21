// ----------------------------------- ZOOMABLE IMAGES ANIMATION AND STUFF ------------------------
// Select all the necessary elements from the page
const images = document.querySelectorAll('.zoomImg');
const modal = document.getElementById('modal-view');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');

// A variable to keep track of the currently open image's thumbnail
let lastClickedImg;

// === OPENING THE MODAL ===
images.forEach(img => {
    img.addEventListener('click', function(event) {
        lastClickedImg = event.target;
        const rect = lastClickedImg.getBoundingClientRect();

        // Set the modal content
        modalImg.src = lastClickedImg.src;
        modalCaption.innerHTML = lastClickedImg.alt;

        // **FIX #1: Wait for the new image to load before doing any math**
        // This ensures its dimensions are available and correct.
        modalImg.onload = () => {
            // 1. Make the modal active to get the final rendered size of the image
            modal.classList.add('active');
            const finalWidth = modalImg.offsetWidth;

            // 2. Calculate the starting transform using the same math as the closing animation
            const initialScale = rect.width / finalWidth;
            const initialTranslateX = rect.left + rect.width / 2 - window.innerWidth / 2;
            const initialTranslateY = rect.top + rect.height / 2 - window.innerHeight / 2;

            // 3. Set the starting position *before* the browser paints the fade-in
            modalImg.style.transition = 'none'; // Temporarily disable animation
            modalImg.style.transform = `translate(${initialTranslateX}px, ${initialTranslateY}px) scale(${initialScale})`;
            
            // 4. Force the browser to apply the styles, then re-enable the transition
            void modalImg.offsetWidth;
            modalImg.style.transition = '';

            // 5. Animate to the final state
            requestAnimationFrame(() => {
                modalImg.style.transform = 'none';
            });

            // Clear this handler so it doesn't run again for the same image
            modalImg.onload = null;
        };
    });
});

// === CLOSING THE MODAL ===
modal.addEventListener('click', function() {
    // Recalculate the thumbnail's position on close
    const rect = lastClickedImg.getBoundingClientRect();

    // Calculate the destination transform
    const translateX = rect.left + rect.width / 2 - window.innerWidth / 2;
    const translateY = rect.top + rect.height / 2 - window.innerHeight / 2;
    const scale = rect.width / modalImg.offsetWidth;
    
    // Apply the transform to animate back to the thumbnail's position
    modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    
    // Fade out the modal background
    modal.classList.remove('active');
    
    // **FIX #2: After the animation finishes, reset the transform style.**
    // This prevents the modal from "remembering" its last position.
    setTimeout(() => {
        modalImg.style.transform = '';
    }, 400); // This must match your #modal-img transition duration (0.4s)
});



// ----------------------------------- PROJECT LIST VIEW MORE AND LESS ------------------------
document.addEventListener('DOMContentLoaded', function() {
  const toggleButtons = document.querySelectorAll('.toggle-details-btn');

  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const projectContainer = this.closest('.project-container');
      const details = projectContainer.querySelector('.project-details');
      const textElement = this.querySelector('.toggle-text');

      button.blur(); // Fixes sticky hover
      
      const isExpanded = projectContainer.classList.contains('expanded');
      const nextText = isExpanded ? 'View more' : 'View less';

      // --- Text Animation ---
      textElement.style.opacity = '0'; // 1. Fade the text out

      setTimeout(() => {
        textElement.textContent = nextText; // 2. Change the text when invisible
        textElement.style.opacity = '1'; // 3. Fade the new text in
      }, 200); // This delay (in ms) must match the CSS transition duration

      // --- Main Panel & Arrow Animation (happens in parallel) ---
      projectContainer.classList.toggle('expanded');

      if (!isExpanded) {
        // OPEN IT
        details.style.height = details.scrollHeight + 'px';
      } else {
        // CLOSE IT
        details.style.height = '0px';
      }
    });
  });
});