import React from 'react';
import {Button, Form, Input} from "antd";

class Login extends React.Component {

    loginForm = React.createRef();

    render() {
        return (
            <Form layout={'vertical'} name="loginForm" >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true, message: 'Username is required!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Password is required!'}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Login;
