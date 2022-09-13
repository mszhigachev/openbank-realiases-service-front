import React from 'react';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';

const { TabPane } = Tabs;


const ContentTabs = ({ defaultTabKey, tabs, children, ...props }) => (
    <Tabs defaultActiveKey={defaultTabKey} {...props}>
        {tabs.map((item) => <TabPane tab={item.name} key={item.name} >{item.content}</TabPane>)}
    </Tabs>
);

export { ContentTabs };