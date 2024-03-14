document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const notify = document.querySelectorAll('input[name="notify"]');
    const email = document.querySelector('#email-info input');
    const phone = document.querySelector('#phone-info input');
    const expiration = document.querySelector('#expiration input');
    const userImage = document.querySelector('#user-image');
    const browseButton = document.querySelector('#browse-button');
    const browseText = document.querySelector('#browse-text');
    const amount = document.querySelector('#amount input');

    form.addEventListener('submit', e => {
        let error = false;
        let errorText = '';

        let selectedDate = new Date(expiration.value);

        // Validate selected date is after current date
        if (selectedDate.getTime() <= Date.now()) {
            error = true;
            errorText += ' - Invalid Date (Must be after current date)\n';
        }

        // Validate an image is chosen
        if (browseText.getAttribute('value') === '' || browseText.getAttribute('value') === null) {
            error = true;
            errorText += ' - Must select a valid image\n';
        }

        // Alert the user to an error
        if (error) {
            alert(errorText);
            e.preventDefault();
        }
    });

    notify.forEach(e => {
        e.addEventListener('change', () => {
            if (e.getAttribute('value') === 'email') {  // Email is selected
                email.setAttribute('required', '');
                phone.removeAttribute('required');
            } else if (e.getAttribute('value') === 'sms') {  // Phone number is selected
                phone.setAttribute('required', '');
                email.removeAttribute('required');
            } else {  // No notification is selected
                email.removeAttribute('required');
                phone.removeAttribute('required');
            }
        });
    });

    browseButton.addEventListener('change', e => {
        if (e.target.files && e.target.files[0]) {  // Preview an image (method 1 from https://www.tutorialspoint.com/preview-an-image-before-it-is-uploaded-in-javascript)
            let reader = new FileReader();
            reader.onload = function(f) {
                userImage.setAttribute('src', f.target.result);
                browseText.setAttribute('value', e.target.files[0].name);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });
});