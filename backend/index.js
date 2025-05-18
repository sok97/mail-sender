const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = 3000;

// Load environment variables
const GmailPassword = process.env.GMAIL_PASSWORD;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

// Create a separate function for sending emails
async function sendEmail(req, res) {
  try {
    const { recipient, subject, message } = req.body;
    console.log('Form data received:', { recipient, subject, message }); // Debugging

    // Validate input data
    if (!recipient || !subject || !message) {
      return res.status(400).send('Invalid input data');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'patrasumit215@gmail.com',
        pass: GmailPassword, // Use environment variable
      },
    });

    const mailOptions = {
      from: 'patrasumit215@gmail.com', // Valid sender email
      to: recipient,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email. Please try again later.');
  }
}

app.post('/send-email', sendEmail);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});