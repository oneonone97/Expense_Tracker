// Switch between forms
function switchToLogin() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

function switchToSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

// Signup function
async function signup(e) {
    try {
        e.preventDefault();
        document.getElementById('signup_msg').innerHTML = '';
        document.getElementById('signup_error').innerHTML = '';

        const signupDetails = {
            name: document.getElementById('signup_name').value.trim(),
            email: document.getElementById('signup_email').value.trim(),
            password: document.getElementById('signup_password').value.trim()
        };

        if (!signupDetails.name || !signupDetails.email || !signupDetails.password) {
            document.getElementById('signup_error').innerHTML = `<p>All fields are required.</p>`;
            return;
        }

        const response = await axios.post('http://localhost:3001/user/signup', signupDetails);

        if (response.status === 201) {
            document.getElementById('signup_msg').innerHTML = `<p>${response.data.message}</p>`;
            document.getElementById('signup-form').reset();
            switchToLogin();
        }
    } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'An error occurred.';
        document.getElementById('signup_error').innerHTML = `<p>${errorMessage}</p>`;
    }
}

// Login function
async function login(e) {
    try {
        e.preventDefault();
        document.getElementById('login_msg').innerHTML = '';
        document.getElementById('login_error').innerHTML = '';

        const loginDetails = {
            email: document.getElementById('login_email').value.trim(),
            password: document.getElementById('login_password').value.trim()
        };

        if (!loginDetails.email || !loginDetails.password) {
            document.getElementById('login_error').innerHTML = `<p>All fields are required.</p>`;
            return;
        }

        const response = await axios.post('http://localhost:3001/user/login', loginDetails);

        // if (response.status === 200) {
            document.getElementById('login_msg').innerHTML = `<p>Login successful!</p>`;
            console.log(response.data);
            localStorage.setItem('token', response.data.token)
            // Redirect or perform any action
            window.location.href = '../public/dashboard/home.html';
        // }
        console.log(response);
    } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'An error occurred.';
        document.getElementById('login_error').innerHTML = `<p>${errorMessage}</p>`;
    }
}
