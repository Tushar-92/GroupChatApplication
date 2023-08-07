
async function login(event) {
    try {
        event.preventDefault();

        let Email = document.getElementById('email').value;
        let Password = document.getElementById('password').value;

        const obj = {
            email: Email,
            password: Password
        }

        const response = await axios.post("http://localhost:3000/user/login" , obj);

        if(response.status === 200) {
            alert(response.data.message);
            localStorage.setItem('token' , response.data.token);
            window.location.href = "../Chat Window/chatWindow.html";
        } 
        
    } catch (error) {
        console.log(error);
        // console.log(error.response);
        // console.log(error.response.data);
        console.log(error.response.data.message);
        console.log(error.response.status);
        
        
        if(error.response.status === 401) alert(error.response.data.message);
        else if (error.response.status === 404) alert(error.response.data.message);
        else document.body.innerHTML += `<div style="color:red;"> ${error} </div>`;
        
    }
}