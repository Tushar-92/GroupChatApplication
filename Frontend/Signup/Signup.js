
async function signUp(event) {
    
    try {
        
        event.preventDefault();

        let Name = document.getElementById('name').value;
        let Email = document.getElementById('email').value;
        let Phone = document.getElementById('phone').value;
        let Password = document.getElementById('password').value;

        const obj = {
            name: Name,
            email: Email,
            phone: Phone,
            password: Password
        }

        const response = await axios.post("http://localhost:3000/user/signup", obj);

        if(response.status === 201) {
            alert('Successfully Signed Up');
            window.location.href = "../Login/Login.html";
        } else {
            throw new Error('Failed to Signup');
        }
    
    } catch (error) {
        
        console.log(error);
        console.log(error.response);
        console.log(error.response.data);
        console.log(error.response.data.message);
        console.log(error.response.status);
        
        
        if(error.response.status === 409) alert(error.response.data.message);
        else document.body.innerHTML += `<div style="color:red;"> ${error} </div>`;
    }
}