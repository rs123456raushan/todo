import React, { useState } from 'react';
import { Button, Checkbox, Form, Label, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import validator from 'validator';

export default function Signup() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkbox, setCheckbox] = useState(false);
    const [success, setSuccess] = useState(true);
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const navigate = useNavigate();

    const host = "http://localhost:8000";

    const postData = async () => {
        if (email === '' || password === '') {
            setSuccess(false);
            setTimeout(() => {
                setSuccess(true);
            }, 3000);
        } else if (checkbox) {
            setSuccess(true);
            const info = await fetch(`${host}/api/auth/createuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });
            const data = await info.json();
            console.log(data);
            if (data.error === 'Sorry this user already exist') {
                setSuccess(false);
                setTimeout(() => {
                    setSuccess(true);
                }, 3000);
            } else if (data.errors) {
                setSuccess(false);
                setTimeout(() => {
                    setSuccess(true);
                }, 3000);
            } else {
                navigate('/login');
            }
        }
    }

    const validateEmail = (value) => {
        if (validator.isEmail(value)) {
            setValidEmail(true);
        } else {
            setValidEmail(false);
        }
        setEmail(value);
    }

    const validatePassword = (value) => {
        if (validator.isStrongPassword(value, {
            minLength: 6, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setValidPassword(true)
        } else {
            setValidPassword(false)
        }
        setPassword(value);
    }

    return (
        <div className="main">
            <h2 className="main-header">Todo List</h2>
            <Message error hidden={success}>
                <Message.Header>Fill all the correct details</Message.Header>
                <p>Please fill the correct details !!!</p>
            </Message>

            <Form className="create-form">
                <Form.Field>
                    <label>Email</label>
                    <input placeholder='Email' onChange={({ target: { value } }) => validateEmail(value)} />
                    <div>
                        {(email.length > 0 && (!validEmail)) && <Label horizontal pointing color='red'>Enter a valid email</Label>}
                    </div>
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input type='password' placeholder='Password' onChange={(e) => validatePassword(e.target.value)} />
                    <div>
                        {(password.length > 0 && (!validPassword)) && <Label horizontal pointing color='red'>Enter a valid password</Label>}
                    </div>
                </Form.Field>
                <div className='center'>
                    <Form.Field>
                        <Checkbox label='I agree to the Terms and Conditions' onChange={(e) => setCheckbox(!checkbox)} />
                    </Form.Field>
                </div>
                <div className='login'>
                    <Button active onClick={postData} type='submit'>Sign Up</Button>
                </div>
            </Form>
        </div>
    )
}