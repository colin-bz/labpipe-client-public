import {Divider, Menu} from "antd";
import {
    CrownFilled,
    DatabaseFilled,
    IdcardFilled, LogoutOutlined,
    ProjectFilled,
    RedoOutlined,
    SettingFilled
} from "@ant-design/icons/lib";
import React from "react";

function SideNav() {
    return (
        <Menu theme="dark">
            <Menu.Item>
                <ProjectFilled />
                <span>Projects</span>
            </Menu.Item>
            <Menu.Item>
                <DatabaseFilled />
                <span>View Data</span>
            </Menu.Item>
            <Menu.Item>
                <CrownFilled />
                <span>Manage Server</span>
            </Menu.Item>
            <Menu.Item>
                <Divider />
            </Menu.Item>
            <Menu.Item>
                <SettingFilled />
                <span>Setting</span>
            </Menu.Item>
            <Menu.Item>
                <RedoOutlined />
                <span>Reload</span>
            </Menu.Item>
            <Menu.Item>
                <IdcardFilled />
                <span>Profile</span>
            </Menu.Item>
            <Menu.Item>
                <LogoutOutlined />
                <span>Logout</span>
            </Menu.Item>
        </Menu>
    )
}

export default SideNav;
