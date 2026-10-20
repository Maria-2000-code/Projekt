import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Projekt.css'
import logo from '../assets/IU Logo.png'
import { CheckCircleFilled, DesktopOutlined, PieChartOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, DatePicker, Empty, Flex, Form, Input, Layout, Menu, Modal, Progress, Row, Select, theme, Typography, Tabs, ConfigProvider } from 'antd'
import deDE from 'antd/locale/de_DE'
import dayjs from 'dayjs'
import 'dayjs/locale/de'

dayjs.locale('de')

const { Header, Content, Sider } = Layout
const { Title, Text } = Typography

const SEITENRAND = 24

const mainItems = [
    { key: '1', icon: <PieChartOutlined />, label: 'Projekte' },
    { key: '2', icon: <DesktopOutlined />, label: 'Benutzer' },
    { key: '3', icon: <DesktopOutlined />, label: 'Rolle' },
]

const logoutItem = [
    { key: '4', icon: <DesktopOutlined />, label: 'Abmelden' },
]

// Testdaten
const startProjekte = [
    { 
        id: 1, 
        name: 'Website-Relaunch', 
        beschreibung: 'Relaunch der Unternehmenswebsite inklusive neuem CMS und modernem Design.',
        leiter: 'A. Beispiel', 
        auftraggeber: 'Muster GmbH', 
        start: '01.09.2026', 
        ende: '31.12.2026', 
        mitarbeiter: [1, 4, 5],
        status: 'Aktiv', 
        aufgabenErledigt: 12, 
        aufgabenGesamt: 20 
    },
    { 
        id: 2, 
        name: 'CRM-Einführung', 
        beschreibung: 'Implementierung des neuen CRM-Systems für den Vertrieb.',
        leiter: 'B. Test', 
        auftraggeber: 'Beispiel AG', 
        start: '15.10.2026', 
        ende: '30.06.2027', 
        mitarbeiter: [2, 6],
        status: 'Aktiv', 
        aufgabenErledigt: 3, 
        aufgabenGesamt: 18 
    },
    { 
        id: 3, 
        name: 'Server-Migration', 
        beschreibung: 'Migration aller lokalen Server in die Cloud.',
        leiter: 'C. Muster', 
        auftraggeber: 'Demo KG', 
        start: '01.01.2025', 
        ende: '30.06.2025', 
        mitarbeiter: [3, 7],
        status: 'Archiviert', 
        aufgabenErledigt: 9, 
        aufgabenGesamt: 9 
    },
]

// Testdaten inklusive Status
const benutzer = [
    { id: 1, name: 'A. Beispiel', rolle: 'Projektleiter', status: 'Nicht Aktiv' },
    { id: 2, name: 'B. Test', rolle: 'Projektleiter', status: 'Aktiv' },
    { id: 3, name: 'C. Muster', rolle: 'Projektleiter', status: 'Nicht Aktiv' },
    { id: 4, name: 'D. Schmidt', rolle: 'Mitarbeiter', status: 'Aktiv' },
    { id: 5, name: 'E. Weber', rolle: 'Mitarbeiter', status: 'Aktiv' },
    { id: 6, name: 'F. Fischer', rolle: 'Mitarbeiter', status: 'Nicht Aktiv' },
    { id: 7, name: 'G. Becker', rolle: 'Mitarbeiter', status: 'Aktiv' },
]

const aktiveBenutzer = benutzer.filter((b) => b.status === 'Aktiv')

const leiterOptionen = aktiveBenutzer
    .filter((b) => b.rolle === 'Projektleiter')
    .map((b) => ({ value: b.name, label: b.name }))

const mitarbeiterOptionen = aktiveBenutzer.map((b) => ({
    value: b.id,
    label: (
        <span>
            {b.name} <Text type="secondary">({b.rolle})</Text>
        </span>
    ),
}))

const projektStatusOptionen = [
    { value: 'Aktiv', label: 'Aktiv' },
    { value: 'Archiviert', label: 'Archiviert' },
]

function MitarbeiterCheckboxGroup({ value, onChange }) {
    const { status } = Form.Item.useStatus()
    const { token } = theme.useToken()

    const hasError = status === 'error'

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: 16,
                maxHeight: 420,
                overflowY: 'auto',
                border: `1px solid ${hasError ? token.colorError : token.colorBorder}`,
                borderRadius: token.borderRadiusLG,
                transition: 'border-color 0.2s',
            }}
        >
            <Checkbox.Group
                options={mitarbeiterOptionen}
                value={value}
                onChange={onChange}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                }}
            />
        </div>
    )
}

function ProjektCard({ projekt, onClick }) {
    const prozent =
        projekt.aufgabenGesamt > 0
            ? Math.round((projekt.aufgabenErledigt / projekt.aufgabenGesamt) * 100)
            : 0

    return (
        <Card
            hoverable
            onClick={onClick}
            title={projekt.name}
            style={{ border: '1px solid var(--akzent)' }}
        >
            <p style={{ marginBottom: 12 }}>
                <Text type="secondary">Projektleiter: </Text>
                {projekt.leiter}
            </p>
            <p style={{ marginBottom: 12 }}>
                <Text type="secondary">Auftraggeber: </Text>
                {projekt.auftraggeber}
            </p>
            <p style={{ marginBottom: 12 }}>
                <Text type="secondary">Zeitraum: </Text>
                {projekt.start} bis {projekt.ende}
            </p>

            <Progress
                percent={prozent}
                strokeColor="var(--akzent)"
                format={(wert) =>
                    wert === 100 ? <CheckCircleFilled style={{ color: 'var(--akzent)' }} /> : `${wert}%`
                }
            />

            <Text type="secondary">
                Fortschritt: {projekt.aufgabenErledigt} von {projekt.aufgabenGesamt} Aufgaben erledigt
            </Text>
        </Card>
    )
}

function ProjektListe({ liste, onOeffnen }) {
    if (liste.length === 0) {
        return <Empty description="Keine Projekte vorhanden" />
    }

    return (
        <Row gutter={[16, 16]}>
            {liste.map((p) => (
                <Col key={p.id} xs={24} md={12} xl={8}>
                    <ProjektCard 
                        projekt={p} 
                        onClick={() => onOeffnen(p.id)} 
                    />
                </Col>
            ))}
        </Row>
    )
}

function Projekt() {
    const navigate = useNavigate()
    const [projekte, setProjekte] = useState(startProjekte)
    const [modalOffen, setModalOffen] = useState(false)
    const [form] = Form.useForm()

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()

    const handleMenuClick = ({ key }) => {
        if (key === '1') navigate('/projekt')
        else if (key === '2') navigate('/benutzer')
        else if (key === '3') navigate('/rolle')
        else if (key === '4') navigate('/login')
    }

    const oeffneProjekt = (id) => {
        navigate(`/projekt/${id}`)
    }

    const oeffneNeuesProjektModal = () => {
        form.resetFields()
        setModalOffen(true)
    }

    const schliesseModal = () => {
        setModalOffen(false)
        form.resetFields()
    }

    const handleNeuesProjekt = (werte) => {
        const neuesProjekt = {
            id: Date.now(),
            name: werte.name,
            beschreibung: werte.beschreibung,
            leiter: werte.leiter,
            auftraggeber: werte.auftraggeber,
            start: werte.zeitraum[0].format('DD.MM.YYYY'),
            ende: werte.zeitraum[1].format('DD.MM.YYYY'),
            mitarbeiter: werte.mitarbeiter || [],
            status: werte.status,
            aufgabenErledigt: 0,
            aufgabenGesamt: 0,
        }
        setProjekte([neuesProjekt, ...projekte])
        schliesseModal()
    }

    const tabItems = [
        {
            key: '1',
            label: 'Alle',
            children: <ProjektListe liste={projekte} onOeffnen={oeffneProjekt} />,
        },
        {
            key: '2',
            label: 'Aktiv',
            children: (
                <ProjektListe
                    liste={projekte.filter((p) => p.status === 'Aktiv')}
                    onOeffnen={oeffneProjekt}
                />
            ),
        },
        {
            key: '3',
            label: 'Archiviert',
            children: (
                <ProjektListe
                    liste={projekte.filter((p) => p.status === 'Archiviert')}
                    onOeffnen={oeffneProjekt}
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
                                defaultSelectedKeys={['1']}
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
                                Projekte
                            </Title>
                            <div
                                style={{
                                    padding: SEITENRAND,
                                    minHeight: 360,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                <Tabs
                                    defaultActiveKey="1"
                                    items={tabItems}
                                    tabBarExtraContent={
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<PlusOutlined />}
                                            onClick={oeffneNeuesProjektModal}
                                        >
                                            Neues Projekt
                                        </Button>
                                    }
                                />
                            </div>
                        </Content>
                    </Layout>
                </Layout>

                <Modal
                    title="Neues Projekt anlegen"
                    open={modalOffen}
                    onCancel={schliesseModal}
                    onOk={() => form.submit()}
                    okText="Projekt anlegen"
                    cancelText="Abbrechen"
                    width={960}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleNeuesProjekt}
                        autoComplete="off"
                    >
                        <Flex gap={32}>
                            <div style={{ flex: 1 }}>
                                <Form.Item
                                    label="Projektname"
                                    name="name"
                                    rules={[{ required: true, message: 'Bitte einen Projektnamen eingeben.' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Beschreibung"
                                    name="beschreibung"
                                    rules={[{ required: true, message: 'Bitte eine Beschreibung eingeben.' }]}
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>

                                <Form.Item
                                    label="Auftraggeber"
                                    name="auftraggeber"
                                    rules={[{ required: true, message: 'Bitte einen Auftraggeber eingeben.' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Projektleiter"
                                    name="leiter"
                                    rules={[{ required: true, message: 'Bitte einen Projektleiter auswählen.' }]}
                                >
                                    <Select options={leiterOptionen} placeholder="Projektleiter auswählen" />
                                </Form.Item>

                                <Form.Item
                                    label="Status"
                                    name="status"
                                    initialValue="Aktiv"
                                    rules={[{ required: true, message: 'Bitte einen Status wählen.' }]}
                                >
                                    <Select options={projektStatusOptionen} />
                                </Form.Item>

                                <Form.Item
                                    label="Zeitraum"
                                    name="zeitraum"
                                    rules={[{ required: true, message: 'Bitte Start und Ende wählen.' }]}
                                >
                                    <DatePicker.RangePicker
                                        format="DD.MM.YYYY"
                                        placeholder={['Start', 'Ende']}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </div>

                            <div style={{ flex: 1 }}>
                                <Form.Item 
                                    label="Mitarbeiter des Projekts" 
                                    name="mitarbeiter"
                                    rules={[{ required: true, message: 'Bitte mindestens einen Mitarbeiter wählen.'}]}
                                >
                                    <MitarbeiterCheckboxGroup />
                                </Form.Item>
                            </div>
                        </Flex>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    )
}

export default Projekt