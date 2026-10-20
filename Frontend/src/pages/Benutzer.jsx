import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Benutzer.css'
import logo from '../assets/IU Logo.png'
import { DesktopOutlined, PieChartOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Card, Table, Layout, Menu, Typography, Modal, Form, Input, Select, ConfigProvider, Flex, Space, theme } from 'antd'
import deDE from 'antd/locale/de_DE'

const { Header, Content, Sider } = Layout
const { Title } = Typography

const SEITENRAND = 24

const mainItems = [
    { key: '1', icon: <PieChartOutlined />, label: 'Projekte' },
    { key: '2', icon: <DesktopOutlined />, label: 'Benutzer' },
    { key: '3', icon: <DesktopOutlined />, label: 'Profil' },
]

const logoutItem = [
    { key: '4', icon: <DesktopOutlined />, label: 'Abmelden' },
]

// Testdaten
const startBenutzer = [
    { id: 1, name: 'A. Beispiel', mail: 'eins@muster.de', rolle: 'Projektleiter', status: 'Nicht Aktiv' },
    { id: 2, name: 'B. Test', mail: 'zwei@muster.de', rolle: 'Projektleiter', status: 'Aktiv' },
    { id: 3, name: 'C. Muster', mail: 'drei@muster.de', rolle: 'Projektleiter', status: 'Nicht Aktiv' },
    { id: 4, name: 'D. Schmidt', mail: 'vier@muster.de', rolle: 'Mitarbeiter', status: 'Aktiv' },
    { id: 5, name: 'E. Weber', mail: 'fünf@muster.de', rolle: 'Mitarbeiter', status: 'Aktiv' },
    { id: 6, name: 'F. Fischer', mail: 'sechs@muster.de', rolle: 'Mitarbeiter', status: 'Nicht Aktiv' },
    { id: 7, name: 'G. Becker', mail: 'sieben@muster.de', rolle: 'Mitarbeiter', status: 'Aktiv' },
]

const rollenOptionen = [
    { value: 'Administrator', label: 'Administrator' },
    { value: 'Projektleiter', label: 'Projektleiter' },
    { value: 'Mitarbeiter', label: 'Mitarbeiter' },
]

const statusOptionen = [
    { value: 'Aktiv', label: 'Aktiv' },
    { value: 'Nicht Aktiv', label: 'Nicht Aktiv' },
]

function Benutzer() {
    const navigate = useNavigate()
    const [benutzerListe, setBenutzerListe] = useState(startBenutzer)
    const [modalOffen, setModalOffen] = useState(false)
    const [bearbeiteterBenutzer, setBearbeiteterBenutzer] = useState(null)
    const [form] = Form.useForm()

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()

    const [filterRolle, setFilterRolle] = useState('Alle')
    const [filterStatus, setFilterStatus] = useState('Alle')

    const handleMenuClick = ({ key }) => {
        if (key === '1') navigate('/projekt')
        else if (key === '2') navigate('/benutzer')
        else if (key === '3') navigate('/rolle')
        else if (key === '4') navigate('/login')
    }

    const oeffneNeuerBenutzerModal = () => {
        setBearbeiteterBenutzer(null)
        form.resetFields()
        setModalOffen(true)
    }

    const oeffneBearbeitenModal = (benutzerItem) => {
        setBearbeiteterBenutzer(benutzerItem)
        form.setFieldsValue({
            name: benutzerItem.name,
            mail: benutzerItem.mail,
            rolle: benutzerItem.rolle,
            status: benutzerItem.status,
        })
        setModalOffen(true)
    }

    const schliesseModal = () => {
        setModalOffen(false)
        setBearbeiteterBenutzer(null)
        form.resetFields()
    }

    const handleBenutzerSpeichern = (werte) => {
        if (bearbeiteterBenutzer) {
            setBenutzerListe(
                benutzerListe.map((b) =>
                    b.id === bearbeiteterBenutzer.id
                        ? { ...b, ...werte }
                        : b
                )
            )
        } else {
            const neuerBenutzerObj = {
                id: Date.now(),
                ...werte,
            }
            setBenutzerListe([neuerBenutzerObj, ...benutzerListe])
        }
        schliesseModal()
    }

    const gefilterteBenutzer = benutzerListe.filter((b) => {
        const passtRolle = filterRolle === 'Alle' || b.rolle === filterRolle
        const passtStatus = filterStatus === 'Alle' || b.status === filterStatus
        return passtRolle && passtStatus
    })

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Benutzername',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'E-Mail-Adresse',
            dataIndex: 'mail',
            key: 'mail',
        },
        {
            title: 'Rolle',
            dataIndex: 'rolle',
            key: 'rolle',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Aktionen',
            key: 'aktionen',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EditOutlined style={{ color: 'var(--akzent)' }} />}
                    onClick={() => oeffneBearbeitenModal(record)}
                />
            ),
        },
    ]

    return (
        <ConfigProvider locale={deDE}>
            <div className="projekt-seite">
                <Layout style={{ minHeight: '100vh', width: '100%' }}>
                    <Sider width={400} theme="dark" className="projekt-sider">
                        <div className="projekt-sider-top">
                            <div className="projekt-logo-kopf">
                                <div className="logo-container">
                                    <img src={logo} alt="IU Logo" className="login-logo" />
                                </div>
                            </div>

                            <div className="projekt-titel-kopf">
                                <Title level={4} style={{ margin: 0, color: '#ffffff', textAlign: 'center' }}>
                                    Aufgabenmanagementsystem
                                </Title>
                            </div>

                            <Menu
                                defaultSelectedKeys={['2']}
                                mode="inline"
                                theme="dark"
                                items={mainItems}
                                onClick={handleMenuClick}
                            />
                        </div>

                        <div className="projekt-menu-unten">
                            <Menu
                                mode="inline"
                                theme="dark"
                                items={logoutItem}
                                onClick={handleMenuClick}
                            />
                        </div>
                    </Sider>

                    <Layout>
                        <Header style={{ padding: '0 24px', background: colorBgContainer }} />
                        <Content style={{ margin: '0 16px' }}>
                            <Title level={2} style={{ margin: '16px 0', paddingLeft: SEITENRAND }}>
                                Benutzer
                            </Title>
                            <div
                                style={{
                                    padding: SEITENRAND,
                                    minHeight: 360,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                <Card style={{ border: '1px solid var(--akzent)' }}>
                                    <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                                        <Space size="middle">
                                            <span>Rolle:</span>
                                            <Select
                                                value={filterRolle}
                                                onChange={setFilterRolle}
                                                style={{ width: 160 }}
                                                options={[
                                                    { value: 'Alle', label: 'Alle Rollen' },
                                                    ...rollenOptionen,
                                                ]}
                                            />
                                            <span>Status:</span>
                                            <Select
                                                value={filterStatus}
                                                onChange={setFilterStatus}
                                                style={{ width: 160 }}
                                                options={[
                                                    { value: 'Alle', label: 'Alle Status' },
                                                    ...statusOptionen,
                                                ]}
                                            />
                                        </Space>

                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<PlusOutlined />}
                                            onClick={oeffneNeuerBenutzerModal}
                                        >
                                            Neuer Benutzer
                                        </Button>
                                    </Flex>

                                    <Table
                                        columns={columns}
                                        dataSource={gefilterteBenutzer}
                                        rowKey="id"
                                        pagination={{ pageSize: 10 }}
                                        size="small"
                                    />
                                </Card>
                            </div>
                        </Content>
                    </Layout>
                </Layout>

                <Modal
                    title={bearbeiteterBenutzer ? 'Benutzer bearbeiten' : 'Neuen Benutzer anlegen'}
                    open={modalOffen}
                    onCancel={schliesseModal}
                    onOk={() => form.submit()}
                    okText={bearbeiteterBenutzer ? 'Speichern' : 'Benutzer anlegen'}
                    cancelText="Abbrechen"
                    width={480}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleBenutzerSpeichern}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Benutzername"
                            name="name"
                            rules={[{ required: true, message: 'Bitte einen Namen eingeben.' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="E-Mail-Adresse"
                            name="mail"
                            rules={[
                                { required: true, message: 'Bitte eine E-Mail-Adresse eingeben.' },
                                { type: 'email', message: 'Bitte eine gültige E-Mail-Adresse eingeben.' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Rolle"
                            name="rolle"
                            initialValue="Mitarbeiter"
                            rules={[{ required: true, message: 'Bitte eine Rolle auswählen.' }]}
                        >
                            <Select options={rollenOptionen} />
                        </Form.Item>

                        <Form.Item
                            label="Status"
                            name="status"
                            initialValue="Aktiv"
                            rules={[{ required: true, message: 'Bitte einen Status auswählen.' }]}
                        >
                            <Select options={statusOptionen} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    )
}

export default Benutzer