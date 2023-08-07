
let chatboxDiv = document.getElementById('chatbox');
let chatboxDivText = document.createElement('div');
chatboxDiv.appendChild(chatboxDivText);

let lastMessageId=1; //declaring it as global variable



async function addChat(event) {

    event.preventDefault();

    try {
        //first let show the message on screen
        let incomingMessage = document.getElementById('usermsg').value;
        let newChat = document.createElement('p');
        newChat.innerHTML = `You:${incomingMessage}`;
        chatboxDivText.appendChild(newChat);

        //now let store the message in database
        obj = {
            message: incomingMessage,
            groupId: localStorage.getItem('newButton.id')
        }

        const token = localStorage.getItem('token');
        const response = await axios.post("http://localhost:3000/user/message" , obj , { headers: {"Authorization" : token}} );

        if(response === 201) {
            console.log('Message gets succesfuly posted in the database');
            window.location.href = "./chatWindow.html";
        } 

        // getLastMessageId(); // this is done so that sath hi sath local storage me bhi update ho jaye
        
    } catch (error) {
        console.log(error);
        document.body.innerHTML += `<div style="color:red;"> ${err} </div> `;
    }


}



//Through this last message id milte hi turant last 10 chats ko bhi local storage me store karwalenge. Ye function abhi tak as a call back use nahi hua hai, upto Task-10 hua tha.
// async function getLastMessageId() {
//     try {
//         const response = await axios.get(`http://localhost:3000/user/message/lastMessageId/${newButtonid}`); 
//         // console.log(response);
//         // console.log(response.data[0]);
//         const result = response.data[0];
//         lastMessageId = result ['MAX(`id`)'];
//         console.log(lastMessageId);

//         //Now we know the last message id so lage hat also let store these last 10 chats from database into our localstorage
//         getChat();

    
//     } catch (error) {
//         console.log(error);
//         document.body.innerHTML += `<div style="color:red;"> ${error} </div> `;
//     }
// }



function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload); 
}



// // Last message id milte hi last 10 chats fetch kar lenge via this function. Ye function abhi tak as a callback use nahi hua hai. Upto Task-10 hua tha.
// async function getChat() {

//     try {
        
//         const response = await axios.get(`http://localhost:3000/user/message/${newButtonid}/?lastMessageId=${lastMessageId}`); 
//         console.log(response);
//         console.log(response.data);

//         let last10Chats = response.data;
//         localStorage.setItem("last10Chats" , JSON.stringify(last10Chats));

        
//     } catch (error) {
//         console.log(error);
//         document.body.innerHTML += `<div style="color:red;"> ${error} </div> `;
//     }
// }




//Through this local storage se read kar k screen pe show karwa denge.
function displayChats() {
    
    //lets first decode the jwt token so that current user k chats se pehle "You" laga paye
    let token = localStorage.getItem('token');

    const decodeToken = parseJwt(token);
    console.log(decodeToken);

    const currentUserId = decodeToken.userId;
    console.log(currentUserId);
    
    //Now lets display it on screen by reading from local storage
    const arrayOfObjects = JSON.parse(localStorage.getItem('last10Chats'));

    for(let i=0;i<arrayOfObjects.length;i++) {
            
        let oldChat = document.createElement('p');
        chatboxDivText.appendChild(oldChat);

        if(arrayOfObjects[i].GroupChatAppUserId === currentUserId) {
            oldChat.innerHTML = `You: ${arrayOfObjects[i].Message}`;
        } else {
            oldChat.innerHTML = `${arrayOfObjects[i].Name}: ${arrayOfObjects[i].Message}`;
        }

    }

}



window.addEventListener("DOMContentLoaded" , async function() {
    
    try {
        
        let response = await axios.get(`http://localhost:3000/user/getgroups`); 
        // console.log(response);
        // console.log(response.data);

        for(let i=0;i<response.data.length;i++) {
            let divNamedwrapper = document.getElementById('wrapper');
            let groupsDiv = document.getElementById('groups');
            divNamedwrapper.appendChild(groupsDiv);
    
            let newButton = document.createElement("button");
    
            newButton.classList = "groupNameButton";
            newButton.id = `${response.data[i].id}`;
            
            newButton.onclick = async function(){
                localStorage.setItem('newButton.id' , `${newButton.id}`); //ye new message ko chat table me group id dene k kam ayega.
                                
                //Let's first check whether current user have joined this group or not by query from user_group table, if he had already joined then start displaying him the older message og that group.
                const token = localStorage.getItem('token');
                const result = await axios.get(`http://localhost:3000/user/isUserjoinedThisGroup/${newButton.id}` , { headers: {"Authorization" : token}});
                    // console.log(result);
                    // console.log(result.data);
                if(result.data.length == 0) {
                      if (confirm("You are not the member of this group. To join click OK!") == true) {
                            // console.log('You Clicked on OK!');
                        const token = localStorage.getItem('token');
                        const obj = {
                            GroupId: newButton.id
                        }
                
                        const result =  await axios.post("http://localhost:3000/user/createEntryInJunction" , obj , { headers: {"Authorization" : token}});
                        if(result.status === 201) {
                            console.log('Record Created in Junction table');
                            console.log(result);
                            alert("You are now Member of This Group!");
                        }
                    } 
                } 
                else {
                    
                    ////////////////////////////////// show the last 10 message of this group
                    
                    // getLastMessageId of that group
                    let response1 = await axios.get(`http://localhost:3000/user/message/lastMessageId/${newButton.id}`); 
                        // console.log(response1);
                        // console.log(response1.data[0]);
                    const result = response1.data[0];
                    lastMessageId = result ['MAX(`id`)'];
                    console.log(lastMessageId); 
                    
                    
                    //getChat of that group
                    let response2 = await axios.get(`http://localhost:3000/user/message/${newButton.id}/?lastMessageId=${lastMessageId}`); 
                    console.log(response2);
                    console.log(response2.data);
                    let last10Chats = response2.data;
                    localStorage.setItem("last10Chats" , JSON.stringify(last10Chats));

                    //now display the chat of that group
                    displayChats();
                
                }
                
            };
            
            newButton.innerHTML = `${response.data[i].Name} <br>`;
            groupsDiv.appendChild(newButton);
        }

        } catch (error) {
        console.log(error);
        document.body.innerHTML += `<div style="color:red;"> ${error} </div> `;
    }
});



// Below is for refreshing the page and fetching chats from database after every 1 second
setInterval(async ()=> {
    
    chatboxDivText.innerHTML = "";
    
    let newButtonid = localStorage.getItem('newButton.id');    
    
    // getLastMessageId of that group
    let response1 = await axios.get(`http://localhost:3000/user/message/lastMessageId/${newButtonid}`); 
        // console.log(response1);
        // console.log(response1.data[0]);
    const result = response1.data[0];
    lastMessageId = result ['MAX(`id`)'];
    console.log(lastMessageId);
    
    //getChat of that group
    let response2 = await axios.get(`http://localhost:3000/user/message/${newButtonid}/?lastMessageId=${lastMessageId}`); 
    console.log(response2);
    console.log(response2.data);

    let last10Chats = response2.data;
    localStorage.setItem("last10Chats" , JSON.stringify(last10Chats));

    //now display the chat of that group
    displayChats();

} , 1000);



//Function to create new group when the user clicks on Create Group Button
async function createNewGroup(event) {
    
    try {
        // event.preventDefault();

        let groupName = prompt("Please enter Group Name");
        let groupAdminName = prompt("Please enter Admin name");

        let Name = groupName;
        let Admin = groupAdminName;

        const obj = {
            Name: Name,
            Admin: Admin
        }

        const response = await axios.post("http://localhost:3000/user/createGroup" , obj);

        if(response === 201) {
            console.log('Succesfuly Created New Group in Database');

            let divNamedwrapper = document.getElementById('wrapper');
            let groupsDiv = document.getElementById('groups');
            divNamedwrapper.appendChild(groupsDiv);
    
            let newButton = document.createElement("button");
    
            newButton.classList = "groupNameButton";
            newButton.innerHTML = `${groupName} <br>`;
            groupsDiv.appendChild(newButton);
            
        } 
        
    } catch (error) {
        console.log(error);
        // console.log(error.response);
        // console.log(error.response.data);
        console.log(error.response.data.message);
        console.log(error.response.status);
        
        
        document.body.innerHTML += `<div style="color:red;"> ${error} </div>`;
        
    }
}







