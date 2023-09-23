import React from 'react';
import './App.css';

const url = process.env.SERVER_URL || 'http://localhost:3000';

const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    let {username, email, password} = Object.fromEntries(data.entries());

    fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({username, email, password})
    }).then(res => {
        console.log(`res.status: ${res.status}`)
        if (res.status === 201) {
            alert(`${username} registered to database.`);
            return res.json();
        } else {
            alert(`Error registering user: ${res.status}`);
            return res.json();
        }
    }).catch(err => {
        console.log(err);
        alert("Error registering user.");
    });
}

function App() {
    return (
        <div className="App">
            <div className="App-header">
                <form onSubmit={handleSubmit} method="post">
                    <h2>Register Account</h2>
                    <div>
                        <label>Username: </label>
                        <input className="input-field" type="text" name="username" required/>
                    </div>
                    <div>
                        <label>Email: </label>
                        <input className="input-field" type="email" name="email" required/>
                    </div>
                    <div>
                        <label>Password: </label>
                        <input className="input-field" type="password" name="password" required/>
                    </div>
                    <div>
                        <input className="input-button" type="submit" value="Register"/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default App;
