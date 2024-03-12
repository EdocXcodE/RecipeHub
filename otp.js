// Import the Twilio module
const twilio = require('twilio');

// Set your Twilio Account SID and Auth Token
const accountSid = 'ACbfadebaba5945829411b25cbc0c4a3e3';
const authToken = '6df57fdf0557a12a6f8e77d70661c359';

// Create a new Twilio client 
const client = new twilio(accountSid, authToken);

// Set up the verification service SID and verified phone number
const verifySid = 'VA70c9f4375230e61a71a9eb6e5faf2953';
const verifiedNumber = '+916266965710';

// Send OTP verification code via SMS
client.verify.v2.services(verifySid)
  .verifications
  .create({ to: verifiedNumber, channel: 'sms' })
  .then(verification => console.log(verification.status))
  .catch(error => console.error(error));

// Prompt user to enter OTP code
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please enter the OTP:', (otpCode) => {
  // Check the OTP code
  client.verify.v2.services(verifySid)
    .verificationChecks
    .create({ to: verifiedNumber, code: otpCode })
    .then(verificationCheck => console.log(verificationCheck.status))
    .catch(error => console.error(error));

  rl.close();
});
