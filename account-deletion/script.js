// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAGAb53jR2GdXk-UBwU421eUyk-MFeCgpU",
  authDomain: "health-care-2e282.firebaseapp.com",
  databaseURL: "https://health-care-2e282-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "health-care-2e282",
  storageBucket: "health-care-2e282.firebasestorage.app",
  messagingSenderId: "861947128612",
  appId: "1:861947128612:web:298d659aa650cdf2e221b1",
  measurementId: "G-VP8RWYPSCT"
};

// Initialize Firebase App
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const functions = firebase.functions();

// Get DOM elements
const form = document.getElementById('deleteAccountForm');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const requestOtpBtn = document.getElementById('requestOtpBtn');
const backBtn = document.getElementById('backBtn');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Store verification data
let verificationId = '';
let otpResendTimer = null;
let resendCountdown = 0;

// Handle request OTP button click
requestOtpBtn.addEventListener('click', async () => {
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  
  if (!phoneNumber) {
    showError('Please enter a valid phone number');
    return;
  }
  
  // Disable button and show loading state
  requestOtpBtn.disabled = true;
  requestOtpBtn.innerHTML = '<span class="loading"></span> Sending Code...';
  
  try {
    // Call Firebase function to send OTP
    const sendOtpFunction = firebase.functions().httpsCallable('sendAccountDeletionOtp');
    const result = await sendOtpFunction({ phoneNumber });
    
    if (result.data.success) {
      // Store verification ID
      verificationId = result.data.verificationId;
      
      // Show step 2
      step1.style.display = 'none';
      step2.style.display = 'block';
      
      // Start resend timer
      startResendTimer();
      
      // Add resend link if not already added
      addResendLink();
      
    } else {
      // Show error message
      showError(result.data.message || 'Failed to send verification code');
      
      // Reset button
      requestOtpBtn.disabled = false;
      requestOtpBtn.innerHTML = 'Request Verification Code';
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    showError('Error sending verification code. Please try again later.');
    
    // Reset button
    requestOtpBtn.disabled = false;
    requestOtpBtn.innerHTML = 'Request Verification Code';
  }
});

// Handle back button click
backBtn.addEventListener('click', () => {
  // Show step 1
  step2.style.display = 'none';
  step1.style.display = 'block';
  
  // Reset OTP input
  document.getElementById('otpCode').value = '';
  document.getElementById('confirmDelete').checked = false;
  
  // Reset button
  requestOtpBtn.disabled = false;
  requestOtpBtn.innerHTML = 'Request Verification Code';
  
  // Clear timer
  if (otpResendTimer) {
    clearInterval(otpResendTimer);
    otpResendTimer = null;
  }
  
  // Remove resend link container if it exists
  const resendContainer = document.querySelector('.resend-timer');
  if (resendContainer) {
    resendContainer.remove();
  }
});

// Add resend link to the OTP input
function addResendLink() {
  // Check if resend container already exists
  if (document.querySelector('.resend-timer')) {
    return;
  }
  
  // Create resend container
  const resendContainer = document.createElement('div');
  resendContainer.className = 'resend-timer';
  resendContainer.innerHTML = `Didn't receive the code? <span id="resendCountdown"></span>`;
  
  // Add after OTP input
  const otpGroup = document.getElementById('otpCode').parentNode;
  otpGroup.appendChild(resendContainer);
}

// Start resend timer
function startResendTimer() {
  // Reset countdown
  resendCountdown = 60;
  
  // Update countdown element
  const countdownElement = document.getElementById('resendCountdown');
  if (countdownElement) {
    countdownElement.innerHTML = `Resend in ${resendCountdown}s`;
  }
  
  // Clear existing timer
  if (otpResendTimer) {
    clearInterval(otpResendTimer);
  }
  
  // Start new timer
  otpResendTimer = setInterval(() => {
    resendCountdown--;
    
    if (resendCountdown <= 0) {
      // Clear timer
      clearInterval(otpResendTimer);
      otpResendTimer = null;
      
      // Show resend link
      if (countdownElement) {
        countdownElement.innerHTML = `<a class="resend-link" id="resendLink">Resend Code</a>`;
        
        // Add click event to resend link
        document.getElementById('resendLink').addEventListener('click', async () => {
          // Call function to resend OTP
          const phoneNumber = document.getElementById('phoneNumber').value.trim();
          
          try {
            // Disable resend link
            document.getElementById('resendLink').className = 'resend-link disabled';
            document.getElementById('resendLink').innerHTML = 'Sending...';
            
            // Call Firebase function to resend OTP
            const sendOtpFunction = firebase.functions().httpsCallable('sendAccountDeletionOtp');
            const result = await sendOtpFunction({ phoneNumber });
            
            if (result.data.success) {
              // Store verification ID
              verificationId = result.data.verificationId;
              
              // Start resend timer again
              startResendTimer();
            } else {
              // Show error message
              showError(result.data.message || 'Failed to resend verification code');
              
              // Reset resend link
              document.getElementById('resendLink').className = 'resend-link';
              document.getElementById('resendLink').innerHTML = 'Resend Code';
            }
          } catch (error) {
            console.error('Error resending OTP:', error);
            showError('Error resending verification code');
            
            // Reset resend link
            document.getElementById('resendLink').className = 'resend-link';
            document.getElementById('resendLink').innerHTML = 'Resend Code';
          }
        });
      }
    } else {
      // Update countdown
      if (countdownElement) {
        countdownElement.innerHTML = `Resend in ${resendCountdown}s`;
      }
    }
  }, 1000);
}

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // If we're on step 1, just show step 2
  if (step1.style.display !== 'none') {
    requestOtpBtn.click();
    return;
  }
  
  // Get form data
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const otpCode = document.getElementById('otpCode').value.trim();
  const confirmDelete = document.getElementById('confirmDelete').checked;
  
  // Validate form
  if (!phoneNumber || !otpCode) {
    showError('Please fill in all fields');
    return;
  }
  
  if (!confirmDelete) {
    showError('Please confirm that you understand the account deletion is permanent');
    return;
  }
  
  // Disable submit button and show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading"></span> Processing...';
  backBtn.disabled = true;
  
  try {
    // Verify OTP and delete account
    const verifyOtpFunction = firebase.functions().httpsCallable('verifyOtpAndDeleteAccount');
    const result = await verifyOtpFunction({
      phoneNumber,
      otpCode,
      verificationId
    });
    
    if (result.data.success) {
      // Hide form and show success message
      form.style.display = 'none';
      successMessage.style.display = 'flex';
      
      // Scroll to success message
      successMessage.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Show error message
      showError(result.data.message || 'Failed to verify code. Please try again.');
      
      // Re-enable buttons
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Delete My Account';
      backBtn.disabled = false;
    }
  } catch (error) {
    console.error('Error verifying OTP and deleting account:', error);
    showError('Error processing your request. Please try again later.');
    
    // Re-enable buttons
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Delete My Account';
    backBtn.disabled = false;
  }
});

// Show error message
function showError(message) {
  errorMessage.querySelector('p').textContent = message;
  errorMessage.style.display = 'flex';
  
  // Scroll to error message
  errorMessage.scrollIntoView({ behavior: 'smooth' });
  
  // Hide error after 5 seconds
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 5000);
}

// Add loading indicator style
const style = document.createElement('style');
style.textContent = `
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style); 