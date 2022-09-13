import 'antd/dist/antd.css';
import { observer } from 'mobx-react-lite';
import { Table, Button, Modal, Form, DatePicker, Input, ConfigProvider } from "antd";
import { useState } from 'react';
import moment from "moment";
import 'moment/locale/ru';
import locale from 'antd/es/locale/ru_RU';
import hotFixesStore from '../store/hotFixesStore';
import Style from './Releases.module.css'



const AddHotFixModal = observer((props) => {
    const { releaseId, releaseName } = props
    const [modalVisible, setModalVisible] = useState(false)
    const [hotFixDescription, setHotFixDescription] = useState(undefined)
    const [hotFixDate, setHotFixDate] = useState(undefined)

    const [form] = Form.useForm();
    const handleCancel = () => {
        setModalVisible(false);


    }
    const handleSave = () => {
        hotFixesStore.save(releaseId, releaseName, hotFixDescription, hotFixDate)
        form.resetFields(["hotfixDate","hotfixDesc"])
        setHotFixDescription(undefined)
        setHotFixDate(undefined)
    }


    return (<>
        <Button type="primary" onClick={() => setModalVisible(true)} size='small' className={Style.addHotFixButton}>
            Добавить хотфикс
        </Button>
        <Modal
            title={`Добавть хотфикс к релизу ${releaseName}`}
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
                <Button disabled={!hotFixDescription || !hotFixDate} key="submit" type="primary" loading={hotFixesStore.saving} onClick={handleSave}>
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
                    <Form.Item name = "hotfixDate" label="Дата хотфикса" required={true} >
                        <DatePicker onChange={(e) => e ? setHotFixDate(e.format('YYYY-MM-DDThh:mm:ss')) : setHotFixDate(undefined)} />
                    </Form.Item>

                    <Form.Item name = "hotfixDesc" label="Описание" required={true} onChange={(e) => setHotFixDescription(e.target.value)}>
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </ConfigProvider>
        </Modal>
    </>
    )
})

const Hotfixes = observer((props) => {
    const { hotFixes, releaseId, releaseName } = props
    const hotFixesColumns = [
        { title: "Дата", key: 'dateFix', dataIndex: 'dateFix', render: (value) => { return `${moment(value).format('YYYY-MM-DD')}` } },
        { title: "Описание", key: 'description', dataIndex: 'description' }
    ]
    const locale = {
        emptyText: 'Список хотфиксов пуст',
    }
    return (
        <div className={Style.hotfixWrapper}>
            <AddHotFixModal releaseId={releaseId} releaseName={releaseName} />
            <Table size='small' locale={locale} rowKey="id" dataSource={hotFixes} columns={hotFixesColumns} pagination={{ position: ['none', 'none'] ,pageSize:0}} />
        </div>)

})

export { Hotfixes }