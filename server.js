const express = require('express');
const { unlink } = require('fs');
const multer = require('multer');
const upload = multer({dest: 'static/uploads/'});

const app = express();
const PORT = 80;

app.use(express.static('static'));
app.use(express.urlencoded({extended: true}));

const html_dir = __dirname + '/templates/';

app.get('/', (req, res) => {
    res.sendFile(`${html_dir}form.html`);
});

app.post('/send', upload.single('browse-button'), (req, res) => {

    let senderFirst = req.body['sender-first-name'];
    let senderLast = req.body['sender-last-name'];
    let recFirst = req.body['recipient-first-name'];
    let recLast = req.body['recipient-last-name'];
    let imageTypes = ['image/jpg', 'image/png', 'image/jpeg', 
                    'image/gif', 'image/svg+xml', 'image/webp'];
    let message = '' + req.body['message'];
    let notify = '' + req.body['notify'];
    let email = '' + req.body['email'];
    let phoneNumber = '' + req.body['phone-number'];
    let cardSelect = '' + req.body['card-select'];
    let cardNumber = '' + req.body['card-number'];
    let expiration = '' + req.body['expiration'];
    let ccv = '' + req.body['ccv'];
    let amount = '' + req.body['amount'];
    let terms = '' + req.body['terms'];
    
    // Check for Stu Dent
    if ((senderFirst === 'Stu' || senderFirst === "Stuart") && senderLast === 'Dent') {
        unlink(req.file.path, (err) => {
            if (err) throw err;
        });
        res.sendFile(`${html_dir}error.html`);
    } else if ((recFirst === 'Stu' || recFirst === "Stuart") && recLast === 'Dent') {
        unlink(req.file.path, (err) => {
            if (err) throw err;
        });
        res.sendFile(`${html_dir}error.html`);
    } else {

        error = false;

        error = (senderFirst === '' || senderLast === '') ? true : error;  // Validate sender's name
        error = (!imageTypes.includes(req.file.mimetype)) ? true : error;  // Validate image type
        error = (recFirst === '' || recLast === '') ? true : error;  // Validate recipient's name
        error = message.length < 10 ? true : error;  // Validate length of message
        error = !['email', 'sms', 'no-notify'].includes(notify) ? true : error;  // Validate notification option is selected
        error = (notify === 'email' && email === '') ? true : error;  // Validate email is filled out if selected
        error = (notify === 'sms' && phoneNumber === '') ? true : error;  // Validate phone number is filled out if selected
        error = !['visa', 'mastercard', 'discovery', 'american-express'].includes(cardSelect) ? true : error;  // Validate a card type is chosen
        error = !/^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/.test(cardNumber) ? true : error;  // Validate card number format
        error = (new Date(expiration).getTime() <= Date.now() || new Date(expiration) === null) ? true : error;  // Validate selected date is after current date
        error = !/^[0-9]{3,4}$/.test(ccv) ? true : error;  // Validate ccv format
        error = !/^[0-9]+\.[0-9]+$|^[0-9]+$/.test(amount) ? true : error;  // Validate amount format
        error = terms !== 'on' ? true : error;  // Validate the terms and conditions were accepted

        if (!error) {
            res.sendFile(`${html_dir}success.html`);
        } else {
            unlink(req.file.path, (err) => {
                if (err) throw err;
            });
            res.sendFile(`${html_dir}error.html`);
        }
    }
});

app.all('*', (req, res) => {
    res.send('404 Not Found');
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));