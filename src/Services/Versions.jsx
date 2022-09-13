import 'antd/dist/antd.css';
import { observer } from 'mobx-react-lite';
import { Table, Button, Modal, Form, DatePicker, Input, ConfigProvider } from "antd";
import { useState, useEffect } from 'react';
import moment from "moment";
import 'moment/locale/ru';
import locale from 'antd/es/locale/ru_RU';
import Style from './Services.module.css'
import servicesStore from '../store/servicesStore';



const AddVersionsModal = (props) => {
    const { service } = props
    const [modalVisible, setModalVisible] = useState(false)
    const [comment, setComment] = useState(undefined)
    const [version, setVersion] = useState(undefined)

    const [form] = Form.useForm();
    const handleCancel = () => {
        setModalVisible(false);


    }
    const handleSave = () => {
        service.SaveVersion(version, comment)
        form.resetFields(["comment", "version"])
        setComment(undefined)
        setVersion(undefined)
    }


    return (<>
        <Button type="primary" onClick={() => setModalVisible(true)} size='small' className={Style.addVersionButton}>
            Добавить версию
        </Button>
        <Modal
            title={`Добавть версию к сервису ${service.name}`}
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
                <Button disabled={!comment || !version} key="submit" type="primary" loading={service.savingVersion} onClick={handleSave}>
                    Сохранить
                </Button>
            ]}
        >
            <ConfigProvider locale={locale}>
                <Form
                    form={form}
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                >
                    <Form.Item name="version" label="Версия" required={true} onChange={(e) => setVersion(e.target.value)}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="comment" label="Комментарий" required={true} onChange={(e) => setComment(e.target.value)}>
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </ConfigProvider>
        </Modal>
    </>
    )
}

const Versions = observer((props) => {
    const service = servicesStore.content.find((service) => { return service.id === props.dispayedService })
    const versionsColumns = [
        { title: "Версия", key: 'version', dataIndex: 'version' },
        { title: "Комментарий", key: 'comment', dataIndex: 'comment' },
        { title: "Создана", key: 'createdDate', dataIndex: 'createdDate', render: (value) => { return `${moment(value).format('YYYY-MM-DD HH:MM:SS')}` } },
    ]
    const locale = {
        emptyText: 'Список версий пуст',
    }
    useEffect(() => {
        service.fetchVersions()
    },[props])
    const paginationChange = (page, size) => {
        service.getVersionPage(page - 1, size)
    }
    return (
        <div className={Style.hotfixWrapper}>
            <AddVersionsModal service={service} />
            <Table
                size='small'
                locale={locale}
                rowKey="id"
                dataSource={service.versions}
                columns={versionsColumns}
                loading={service.loadingVersions}
                pagination={{
                    current: service.versionsPageNumber + 1,
                    total: service.versionsTotalPages * service.versionsPageSize,
                    pageSize: service.versionsPageSize,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 50, 100],
                    position: ['topRight', 'none'],
                    onChange: paginationChange
                }}
            />
        </div>)

})
export { Versions }