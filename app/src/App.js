import React from 'react';
import './App.css';



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
