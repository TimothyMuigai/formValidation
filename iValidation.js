const form = document.getElementById('form');
const firstName_input = document.getElementById('finame');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('pass-input');
const confirmPass_input = document.getElementById('confirm');
const error_message = document.getElementById('error-message'); // Make sure this is correct

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    let errors=[];

    if (firstName_input) {
        //if fname then user is in signup
        errors = getSignupFormErrors(firstName_input.value, email_input.value, password_input.value,confirmPass_input.value);

        if (errors.length === 0) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            fetch('http://localhost:3000/users', {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                
            }).then(alert('Saved. Proceed to Login'));
        } else {
            error_message.innerText = errors.join('. ');            
        }

    }else{
        //if no fname then user is in login
        errors = getLoginFormErrors(email_input.value, password_input.value)
        if (errors.length === 0)
            {fetch('http://localhost:3000/users')
            .then(res => res.json())
            .then(data => {
                const user = data.find(user => user.email === email_input.value);
                
                if (user) {
                    if (user.password === password_input.value) {
                        alert(`Welcome ${user.Fname}`);
                        
                    } else {
                        alert("Incorrect password");
                        event.preventDefault();
                    }
                } else {
                    alert("Email is incorrect");
                    event.preventDefault();
                }
            })
            .catch(error => {
                alert('Error fetching data:', error);
            });
        }
    }

    if(errors.length>0){
        event.preventDefault();
        error_message.innerText = errors.join('. ');
    }
});

function getSignupFormErrors(firstName,email,password,confirmPass) {
    let errors = [];
    if(firstName === '' || firstName === null){
        errors.push('first name is required')
        firstName_input.parentElement.classList.add('incorrect')
    }
    if(email === '' || email === null){
        errors.push('email is required')
        email_input.parentElement.classList.add('incorrect')
    }    
    if(password === '' || password === null){
        errors.push('email is required')
        password_input.parentElement.classList.add('incorrect')
    }    
    if(password.length < 8){
        errors.push('Password must be at least 8 characters')
        password_input.parentElement.classList.add('incorrect')
    }   
    if(password !== confirmPass){
        errors.push('Passwords does not match')
        confirmPass_input.parentElement.classList.add('incorrect')
    }    
    return errors;
}

function getLoginFormErrors(email,password) {
    let errors = [];
    
    if(email === '' || email === null){
        errors.push('email is required')
        email_input.parentElement.classList.add('incorrect')
    }    
    if(password === '' || password === null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }  
    return errors;

}

const allInputs=[firstName_input,email_input,password_input,confirmPass_input].filter(input => input !== null);

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect');
            error_message.innerText='';
        }
    });
});