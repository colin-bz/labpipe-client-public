import React from 'react';
import logo from './logo.svg';
import {Divider, Layout, Menu} from 'antd';
import './App.css';
import {
    CrownFilled,
    DatabaseFilled, IdcardFilled,
    LogoutOutlined,
    ProjectFilled,
    RedoOutlined,
    SettingFilled, UserOutlined
} from "@ant-design/icons/lib";
import SideNav from "./SideNav/SideNav";
import Login from "./pages/Login/Login";

const { Header, Content, Footer, Sider } = Layout;

function App() {
    return (
        <Layout>
            <Sider className={'full-vh'}>
                <SideNav/>
            </Sider>
            <Content className={'safe-margin'}>
                <Login />
            </Content>
        </Layout>
    );
}

export default App;
