import { observer } from 'mobx-react-lite';
import 'antd/dist/antd.css';
import { Table, Button, Modal, Form, DatePicker, Input, ConfigProvider } from "antd";
import { useState, useEffect } from 'react';
import moment from "moment";
import 'moment/locale/ru';
import locale from 'antd/es/locale/ru_RU';


import './Table.css'
import { ContentTabs } from '../Components/ContentTabs'
import { Hotfixes } from "./HotFixes";
import releases from "../store/releasesStore";
import Style from './Releases.module.css'

const AddReleaseModal = observer(() => {
    const [modalVisible, setModalVisible] = useState(false)
    const [releaseName, setReleaseName] = useState()
    const [releaseStart, setReleaseStart] = useState()
    const [releaseEnd, setReleaseEnd] = useState()
    const [codeFreeze, setCodeFreeze] = useState()
    const [releaseDescription, setReleaseDescription] = useState()

    const [form] = Form.useForm();

    const handleCancel = () => {
        setModalVisible(false);


    }
    const handleSave = () => {
        releases.save(releaseName, releaseStart, releaseEnd, codeFreeze, releaseDescription)
        form.resetFields(["name","period","hotfixDate","desc"]);
        setReleaseName(undefined)
        setReleaseStart(undefined)
        setReleaseEnd(undefined)
        setCodeFreeze(undefined)
        setReleaseDescription(undefined)

    }

    const handleReleasePeriod = (period) => {
        period ? setReleaseStart(period[0].format('YYYY-MM-DDThh:mm:ss')) : setReleaseStart(undefined)
        period ? setReleaseEnd(period[1].format('YYYY-MM-DDThh:mm:ss')) : setReleaseEnd(undefined)

    }

    return (<>
        <Button type="primary" onClick={() => setModalVisible(true)} className={Style.addReleaseButton}>
            Добавить релиз
        </Button>
        <Modal
            title="Добавть релиз"
            style={{
                top: 80,
            }}
            visible={modalVisible}
            onOk={() => setModalVisible(false)}
            onCancel={() => setModalVisible(false)}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Закрыть
                </Button>,
                <Button disabled={!releaseName || !releaseStart || !releaseEnd || !codeFreeze} key="submit" type="primary" loading={releases.saving} onClick={handleSave}>
                    Сохранить
                </Button>
            ]}
        >
            <ConfigProvider locale={locale}>
                <Form
                    form = {form}
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                >
                    <Form.Item name = "name" label="Имя" required={true} onChange={(e) => setReleaseName(e.target.value)}>
                        <Input />
                    </Form.Item>
                    <Form.Item name = "period" label="Период" required={true}>
                        <DatePicker.RangePicker onChange={handleReleasePeriod} />
                    </Form.Item>
                    <Form.Item name = "hotfixDate" label="Дата код-фриза" required={true} >
                        <DatePicker onChange={(e) => e ? setCodeFreeze(e.format('YYYY-MM-DDThh:mm:ss')) : setCodeFreeze(undefined)} />
                    </Form.Item>
                    <Form.Item name = "desc" label="Описание" onChange={(e) => setReleaseDescription(e.target.value)}>
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </ConfigProvider>
        </Modal>
    </>
    )
})

const ReleasesList = observer(() => {
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const locale = {
        emptyText: 'Список релизов пуст',
    }

    const columns = [
        { title: "Наименование", key: 'name', dataIndex: 'name' },
        { title: "Дата начала", key: 'dateStart', dataIndex: 'dateStart', render: (value) => { return `${moment(value).format('YYYY-MM-DD')}` } },
        { title: "Дата окончания", key: 'dateEnd', dataIndex: 'dateEnd', render: (value) => { return `${moment(value).format('YYYY-MM-DD')}` } },
        { title: "Код-фриз", key: 'dateFreeze', dataIndex: 'dateFreeze', render: (value) => { return `${moment(value).format('YYYY-MM-DD')}` } },
        { title: "Описание", key: 'description', dataIndex: 'description' }
    ]

    useEffect(() => {
        releases.fetchReleases()
    }
        , [])

    const paginationChange = (page, size) => {
        releases.getPage(page - 1, size)
    }

    const onTableRowExpand = (expanded, record) => {
        const keys = [];
        if (expanded) {
            keys.push(record.id);
        }
        setExpandedRowKeys(keys);
    }

    return (
        <>
            <Table
                loading={releases.loading}
                locale={locale}
                rowKey="id"
                dataSource={releases.content}
                columns={columns}
                expandable={{
                    
                    expandedRowKeys: expandedRowKeys,
                    onExpand: onTableRowExpand,
                    expandedRowRender: (record) => (
                        <span
                            style={{
                                margin: 0,

                            }}
                        >
                            {<ContentTabs defaultTabKey="Хотфиксы" tabs={
                                [
                                    { name: "Хотфиксы", content: <Hotfixes releaseId={record.id} releaseName={record.name} hotFixes={record.hotFixes} /> }
                                ]}
                            />
                            }
                        </span>
                    ),
                }}
                pagination={{
                    current: releases.pageNumber + 1,
                    total: releases.totalPages * releases.pageSize,
                    pageSize: releases.pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 50, 100],
                    position: ['topRight', 'none'],
                    onChange: paginationChange
                }}
            />
        </>
    )
})


const Releases = observer(() => {
    return (
        <>
            <AddReleaseModal />
            <ReleasesList />
        </>
    )


})

export { Releases }