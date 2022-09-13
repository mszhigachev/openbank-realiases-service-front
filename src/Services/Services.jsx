import { Button, Card, Checkbox, ConfigProvider, Form, Input, Modal, Space, Spin, Typography, Statistic, Row } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css';
import locale from 'antd/es/locale/ru_RU';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import servicesStore from '../store/servicesStore';
import Style from './Services.module.css';
import { ContentTabs } from '../Components/ContentTabs';
import { Versions } from './Versions';

const AddServiceModal = observer(() => {
    const [modalVisible, setModalVisible] = useState(false)
    const [serviceName, setServiceName] = useState(undefined)
    const [serviceDescription, setServiceDescription] = useState(undefined)
    const [isMicroservice, setMicroservice] = useState(false)

    const [form] = Form.useForm();

    const handleCancel = () => {
        setModalVisible(false);


    }
    const handleSave = () => {
        servicesStore.save(serviceName, serviceDescription, isMicroservice)
        form.resetFields(["name", "microservice", "desc"]);
        setServiceName(undefined)
        setServiceDescription(undefined)
        setMicroservice(false)

    }


    return (<>
        <Button type="primary" onClick={() => setModalVisible(true)}>
            Добавить сервис
        </Button>
        <Modal
            title="Добавть сервис"
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
                <Button disabled={!serviceName} key="submit" type="primary" loading={servicesStore.saving} onClick={handleSave}>
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
                    <Form.Item name="name" label="Имя" required={true} onChange={(e) => setServiceName(e.target.value)}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="desc" label="Описание" onChange={(e) => setServiceDescription(e.target.value)}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="microservice" onChange={(e) => setMicroservice(e.target.checked)} wrapperCol={{ offset: 10, span: 18 }}>
                        <Checkbox>Микросервис</Checkbox>
                    </Form.Item>
                </Form>
            </ConfigProvider>
        </Modal>
    </>
    )
})


const Cards = observer((props) => {
    if (servicesStore.content.length > 0) {
        return (
            <div className={`${Style.servicesCardsWrapper} ${props.isWindowOpen ? Style.window : ''}`}>
                {
                    servicesStore.content.map(
                        (service) =>
                            <Card className={Style.card}
                                key={service.id}
                                hoverable
                                style={{ width: 240, height: 120, margin: 8 }}
                                title={service.name}
                                onClick={() => {
                                    props.handleDisplayed(service.id)
                                    props.handleOpen(true)
                                }
                                }
                            >
                                <div className={Style.cardDescription} >{service.description}</div>
                            </Card>
                    )
                }
            </div>
        )
    }
    else if (servicesStore.loading) {
        return (
            <Space size="large" style={{
                position: "fixed",
                top: "20%",
                left: "50%"
            }}>
                <Spin size="large" />
            </Space>
        )
    }
    else {
        return (
            <Space size="large" style={{
                position: "fixed",
                top: "20%",
                left: "50%"
            }}>
                Сервисы отсутсвуют =(
            </Space>
        )
    }
})

const ServiceWindow = observer((props) => {
    const service = servicesStore.content.find((service) => { return service.id === props.dispayedService })
    const initServiceDescription = service.description
    const initSerivceIsMicroservice = service.microservice
    const [serviceDescription, setServiceDescription] = useState(service.description)
    const [serviceIsMicroservice, setServiceMicroservice] = useState(service.microservice)


    useEffect(() => {
        setServiceDescription(service.description)
        setServiceMicroservice(service.microservice)
    }, [props])

    const handleUpdate = () => {
        service.update(serviceDescription, serviceIsMicroservice)
    }
    return (
        <div className={Style.serviceWindow}>
            <div className={Style.widnowHeader}>
                <CloseCircleOutlined className={Style.windowCloseButton} onClick={() => props.handleClose(false)} />
                <Button disabled={(serviceDescription === initServiceDescription && serviceIsMicroservice === initSerivceIsMicroservice)} size="small" type="primary" loading={service.updating} onClick={() => handleUpdate()} >
                    Обновить
                </Button>
            </div>
            <div className={Style.windowContent}>
                <Row>
                    <Statistic
                        title="Имя"
                        prefix={`${service.name}`}
                        value={" "} />
                    <Statistic style={{ paddingLeft: '10pt' }}
                        title="Микросервис"
                        prefix={
                            <Checkbox checked={serviceIsMicroservice} onChange={(e) => setServiceMicroservice(e.target.checked)}></Checkbox>
                        }
                        value={" "} />
                </Row>
                <Statistic
                    title="Описание"
                    prefix={
                        <Typography.Paragraph
                            style={{
                                fontSize: 14,
                                minWidth: 'calc(80vh - 100%)'
                            }}
                            editable={{
                                onChange: setServiceDescription,
                                maxLength: 2555,
                            }}
                        >
                            {serviceDescription}
                        </Typography.Paragraph>
                    }
                    value={" "} />
                <ContentTabs defaultTabKey="Версии" tabs={
                    [
                        { name: "Версии", content: <Versions dispayedService={props.dispayedService} /> }
                    ]}
                />
            </div>
        </div>
    )
})

const Services = observer(() => {
    const [dispayedService, setDispayedService] = useState()
    const [isWindowOpen, setWindowOpen] = useState(false)

    useEffect(() => {
        servicesStore.fetchServices()
    }, [])

    return (
        <>
            <AddServiceModal />
            <div className={Style.servicesWrapper}>
                <Cards handleOpen={setWindowOpen} handleDisplayed={setDispayedService} isWindowOpen={isWindowOpen} />

            </div>
            {isWindowOpen ? <ServiceWindow handleClose={setWindowOpen} dispayedService={dispayedService} /> : null}
        </>
    )
})

export { Services };

