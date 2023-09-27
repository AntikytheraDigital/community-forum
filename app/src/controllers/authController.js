const url = process.env.SERVER_URL || 'http://localhost:3000';

exports.handleSubmit = (e) => {
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
            return res.json().then(data => {
                alert(`Error: ${data.error}`);
            });
        }
    }).catch(err => {
        console.log(err);
        alert("Server error.");
    });
};
