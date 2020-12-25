import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Axios from 'axios';

export default function Login() {
    const [failedLogin, setLogin] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target[0].value, e.target[1].value);

        let data = {
            "username": e.target[0].value,
            "password": e.target[1].value
        }

        Axios.post("./login", data).then(function(response) {
            console.log(response);
            if (response.data)
                console.log("Logged in successfully"); //prob will just redirect...
            else
                setLogin(true);
        });
    }

    return(
        <form onSubmit = {handleSubmit}>
            <Input id="username" placeholder = "Username"/>
            <Input id="password" placeholder = "Password"/>
            <Button type = "submit" variant = "contained" color = "primary">
                Login     
            </Button>
        </form>
    );
}