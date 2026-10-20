import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Projektdetail.css'
import logo from '../assets/IU Logo.png'
import { DesktopOutlined, PieChartOutlined, PlusOutlined, CheckCircleFilled, EditOutlined } from '@ant-design/icons'
import { Button, Card, Col, Layout, Menu, Progress, Row, theme, Typography, Tabs, Empty, Modal, Form, Input, Select, DatePicker, Checkbox, ConfigProvider, Flex } from 'antd'
import deDE from 'antd/locale/de_DE'
import dayjs from 'dayjs'
import 'dayjs/locale/de'

dayjs.locale('de')

const { Header, Content, Sider } = Layout
const { Title, Text } = Typography

const SEITENRAND = 24

// Testdaten
const angemeldeterBenutzer = 'D. Schmidt'

const mainItems = [
    { key: '1', icon: <PieChartOutlined />, label: 'Projekte' },
    { key: '2', icon: <DesktopOutlined />, label: 'Benutzer' },
    { key: '3', icon: <DesktopOutlined />, label: 'Profil' },
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

// Testdaten
const benutzer = [
    { id: 1, name: 'A. Beispiel', rolle: 'Projektleiter' },
    { id: 2, name: 'B. Test', rolle: 'Projektleiter' },
    { id: 3, name: 'C. Muster', rolle: 'Projektleiter' },
    { id: 4, name: 'D. Schmidt', rolle: 'Mitarbeiter' },
    { id: 5, name: 'E. Weber', rolle: 'Mitarbeiter' },
    { id: 6, name: 'F. Fischer', rolle: 'Mitarbeiter' },
    { id: 7, name: 'G. Becker', rolle: 'Mitarbeiter' },
]

const leiterOptionen = benutzer
    .filter((b) => b.rolle === 'Projektleiter')
    .map((b) => ({ value: b.name, label: b.name }))

const mitarbeiterOptionen = benutzer.map((b) => ({
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

const bearbeiterOptionen = benutzer.map((b) => ({
    value: b.name,
    label: (
        <span>
            {b.name} <Text type="secondary">({b.rolle})</Text>
        </span>
    ),
}))

const statusOptionen = [
    { value: 'Offen', label: 'Offen' },
    { value: 'in Bearbeitung', label: 'in Bearbeitung' },
    { value: 'erledigt', label: 'erledigt' },
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

function AufgabenListe({ liste, onAufgabeKlick }) {
    if (liste.length === 0) {
        return <Empty description="Keine Aufgaben vorhanden" />
    }

    return (
        <Row gutter={[16, 16]}>
            {liste.map((aufgabe) => (
                <Col key={aufgabe.id} xs={24} md={12}>
                    <Card
                        size="small"
                        title={aufgabe.name}
                        extra={
                            <Button
                                type="text"
                                icon={<EditOutlined style={{ color: 'var(--akzent)' }} />}
                                onClick={() => onAufgabeKlick(aufgabe)}
                            />
                        }
                        style={{ border: '1px solid var(--akzent)', height: '100%' }}
                    >
                        <p style={{ marginBottom: 8 }}><Text type="secondary">Beschreibung: </Text>{aufgabe.beschreibung}</p>
                        <p style={{ marginBottom: 8 }}><Text type="secondary">Bearbeiter: </Text>{aufgabe.bearbeiter}</p>
                        <p style={{ marginBottom: 8 }}><Text type="secondary">Zeitraum: </Text>{aufgabe.start} bis {aufgabe.ende}</p>
                        <p style={{ marginBottom: 0 }}><Text type="secondary">Status: </Text>{aufgabe.status}</p>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}

function Projektdetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [projekte, setProjekte] = useState(startProjekte)
    const [projektModalOffen, setProjektModalOffen] = useState(false)
    const [aufgabeModalOffen, setAufgabeModalOffen] = useState(false)
    const [bearbeiteteAufgabe, setBearbeiteteAufgabe] = useState(null)
    const [nurEigene, setNurEigene] = useState(false)

    const [projektForm] = Form.useForm()
    const [aufgabeForm] = Form.useForm()

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()

    const projekt = projekte.find((p) => p.id === parseInt(id))

    const [aufgaben, setAufgaben] = useState([
        { id: 1, projektId: 1, name: 'Design-Entwurf erstellen', beschreibung: 'Mockups in Figma anfertigen', bearbeiter: 'D. Schmidt', start: '01.09.2026', ende: '15.09.2026', status: 'erledigt' },
        { id: 2, projektId: 1, name: 'Frontend-Implementierung', beschreibung: 'React & Ant Design aufsetzen', bearbeiter: 'E. Weber', start: '16.09.2026', ende: '30.10.2026', status: 'in Bearbeitung' },
    ])

    let aktuelleAufgaben = aufgaben.filter((a) => a.projektId === parseInt(id))

    if (nurEigene) {
        aktuelleAufgaben = aktuelleAufgaben.filter((a) => a.bearbeiter === angemeldeterBenutzer)
    }

    const handleMenuClick = ({ key }) => {
        if (key === '1') navigate('/projekt')
        else if (key === '2') navigate('/benutzer')
        else if (key === '3') navigate('/rolle')
        else if (key === '4') navigate('/login')
    }

    // Modal für Projekt bearbeiten
    const oeffneProjektModal = () => {
        if (projekt) {
            projektForm.setFieldsValue({
                name: projekt.name,
                beschreibung: projekt.beschreibung || '',
                auftraggeber: projekt.auftraggeber,
                leiter: projekt.leiter,
                status: projekt.status || 'Aktiv',
                zeitraum: [
                    dayjs(projekt.start, 'DD.MM.YYYY'),
                    dayjs(projekt.ende, 'DD.MM.YYYY'),
                ],
                mitarbeiter: projekt.mitarbeiter || [],
            })
        }
        setProjektModalOffen(true)
    }

    const schliesseProjektModal = () => {
        setProjektModalOffen(false)
        projektForm.resetFields()
    }

    const handleProjektSpeichern = (werte) => {
        setProjekte(
            projekte.map((p) =>
                p.id === parseInt(id)
                    ? {
                          ...p,
                          name: werte.name,
                          beschreibung: werte.beschreibung,
                          auftraggeber: werte.auftraggeber,
                          leiter: werte.leiter,
                          status: werte.status,
                          start: werte.zeitraum[0].format('DD.MM.YYYY'),
                          ende: werte.zeitraum[1].format('DD.MM.YYYY'),
                          mitarbeiter: werte.mitarbeiter || [],
                      }
                    : p
            )
        )
        schliesseProjektModal()
    }

    const oeffneNeueAufgabeModal = () => {
        setBearbeiteteAufgabe(null)
        aufgabeForm.resetFields()
        setAufgabeModalOffen(true)
    }

    const oeffneBearbeitenAufgabeModal = (aufgabe) => {
        setBearbeiteteAufgabe(aufgabe)
        aufgabeForm.setFieldsValue({
            name: aufgabe.name,
            beschreibung: aufgabe.beschreibung,
            bearbeiter: aufgabe.bearbeiter,
            status: aufgabe.status,
            zeitraum: [
                dayjs(aufgabe.start, 'DD.MM.YYYY'),
                dayjs(aufgabe.ende, 'DD.MM.YYYY'),
            ],
        })
        setAufgabeModalOffen(true)
    }

    const schliesseAufgabeModal = () => {
        setAufgabeModalOffen(false)
        setBearbeiteteAufgabe(null)
        aufgabeForm.resetFields()
    }

    const handleAufgabeSpeichern = (werte) => {
        if (bearbeiteteAufgabe) {
            setAufgaben(
                aufgaben.map((a) =>
                    a.id === bearbeiteteAufgabe.id
                        ? {
                              ...a,
                              name: werte.name,
                              beschreibung: werte.beschreibung,
                              bearbeiter: werte.bearbeiter,
                              status: werte.status,
                              start: werte.zeitraum[0].format('DD.MM.YYYY'),
                              ende: werte.zeitraum[1].format('DD.MM.YYYY'),
                          }
                        : a
                )
            )
        } else {
            const neueAufgabeObj = {
                id: Date.now(),
                projektId: parseInt(id),
                name: werte.name,
                beschreibung: werte.beschreibung,
                bearbeiter: werte.bearbeiter,
                start: werte.zeitraum[0].format('DD.MM.YYYY'),
                ende: werte.zeitraum[1].format('DD.MM.YYYY'),
                status: werte.status,
            }
            setAufgaben([neueAufgabeObj, ...aufgaben])
        }
        schliesseAufgabeModal()
    }

    if (!projekt) {
        return (
            <div style={{ padding: 48, textAlign: 'center' }}>
                <Empty description="Projekt nicht gefunden" />
                <Button type="primary" onClick={() => navigate('/projekt')} style={{ marginTop: 16 }}>
                    Zurück zur Übersicht
                </Button>
            </div>
        )
    }

    const alleProjektAufgaben = aufgaben.filter((a) => a.projektId === parseInt(id))
    const aufgabenGesamt = alleProjektAufgaben.length
    const aufgabenErledigt = alleProjektAufgaben.filter((a) => a.status === 'erledigt').length
    const prozent = aufgabenGesamt > 0 ? Math.round((aufgabenErledigt / aufgabenGesamt) * 100) : 0

    const taskTabs = [
        {
            key: '1',
            label: `Alle (${aktuelleAufgaben.length})`,
            children: <AufgabenListe liste={aktuelleAufgaben} onAufgabeKlick={oeffneBearbeitenAufgabeModal} />,
        },
        {
            key: '2',
            label: `Offen (${aktuelleAufgaben.filter((a) => a.status === 'Offen').length})`,
            children: (
                <AufgabenListe
                    liste={aktuelleAufgaben.filter((a) => a.status === 'Offen')}
                    onAufgabeKlick={oeffneBearbeitenAufgabeModal}
                />
            ),
        },
        {
            key: '3',
            label: `In Bearbeitung (${aktuelleAufgaben.filter((a) => a.status === 'in Bearbeitung').length})`,
            children: (
                <AufgabenListe
                    liste={aktuelleAufgaben.filter((a) => a.status === 'in Bearbeitung')}
                    onAufgabeKlick={oeffneBearbeitenAufgabeModal}
                />
            ),
        },
        {
            key: '4',
            label: `Erledigt (${aktuelleAufgaben.filter((a) => a.status === 'erledigt').length})`,
            children: (
                <AufgabenListe
                    liste={aktuelleAufgaben.filter((a) => a.status === 'erledigt')}
                    onAufgabeKlick={oeffneBearbeitenAufgabeModal}
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
                                {projekt.name}
                            </Title>

                            <div
                                style={{
                                    padding: SEITENRAND,
                                    minHeight: 360,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                <Row gutter={[32, 32]}>
                                    <Col xs={24} lg={10}>
                                        <Card 
                                            title="Projektdetails" 
                                            extra={
                                                <Button
                                                    type="text"
                                                    icon={<EditOutlined style={{ color: 'var(--akzent)' }} />}
                                                    onClick={oeffneProjektModal}
                                                />
                                            }
                                            style={{ border: '1px solid var(--akzent)', marginBottom: 24 }}
                                        >
                                            <p style={{ marginBottom: 12 }}><Text type="secondary">Projektleiter: </Text>{projekt.leiter}</p>
                                            <p style={{ marginBottom: 12 }}><Text type="secondary">Auftraggeber: </Text>{projekt.auftraggeber}</p>
                                            <p style={{ marginBottom: 12 }}><Text type="secondary">Zeitraum: </Text>{projekt.start} bis {projekt.ende}</p>
                                            <p style={{ marginBottom: 0 }}><Text type="secondary">Status: </Text>{projekt.status}</p>
                                        </Card>

                                        <Card title="Fortschritt" style={{ border: '1px solid var(--akzent)' }}>
                                            <Progress
                                                percent={prozent}
                                                strokeColor="var(--akzent)"
                                                format={(wert) =>
                                                    wert === 100 ? <CheckCircleFilled style={{ color: 'var(--akzent)' }} /> : `${wert}%`
                                                }
                                            />
                                            <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                                                {aufgabenErledigt} von {aufgabenGesamt} Aufgaben erledigt
                                            </Text>
                                        </Card>
                                    </Col>

                                    <Col xs={24} lg={14}>
                                        <Card 
                                            title="Aufgaben des Projekts" 
                                            extra={
                                                <Button type="primary" size="large" icon={<PlusOutlined />} onClick={oeffneNeueAufgabeModal}>
                                                    Neue Aufgabe
                                                </Button>
                                            }
                                            style={{ border: '1px solid var(--akzent)' }}
                                        >
                                            <div style={{ marginBottom: 16 }}>
                                                <Checkbox 
                                                    checked={nurEigene} 
                                                    onChange={(e) => setNurEigene(e.target.checked)}
                                                >
                                                    Nur meine Aufgaben anzeigen ({angemeldeterBenutzer})
                                                </Checkbox>
                                            </div>

                                            <Tabs defaultActiveKey="1" items={taskTabs} />
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Content>
                    </Layout>
                </Layout>

                {/* Modal für Projektdetails bearbeiten */}
                <Modal
                    title="Projekt"
                    open={projektModalOffen}
                    onCancel={schliesseProjektModal}
                    onOk={() => projektForm.submit()}
                    okText="Speichern"
                    cancelText="Abbrechen"
                    width={960}
                >
                    <Form
                        form={projektForm}
                        layout="vertical"
                        onFinish={handleProjektSpeichern}
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

                {/* Modal für Aufgaben */}
                <Modal
                    title={bearbeiteteAufgabe ? 'Aufgabe' : 'Neue Aufgabe anlegen'}
                    open={aufgabeModalOffen}
                    onCancel={schliesseAufgabeModal}
                    onOk={() => aufgabeForm.submit()}
                    okText={bearbeiteteAufgabe ? 'Speichern' : 'Aufgabe anlegen'}
                    cancelText="Abbrechen"
                    width={600}
                >
                    <Form
                        form={aufgabeForm}
                        layout="vertical"
                        onFinish={handleAufgabeSpeichern}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Aufgabenname"
                            name="name"
                            rules={[{ required: true, message: 'Bitte einen Namen eingeben.' }]}
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
                            label="Bearbeiter"
                            name="bearbeiter"
                            rules={[{ required: true, message: 'Bitte einen Bearbeiter auswählen.' }]}
                        >
                            <Select options={bearbeiterOptionen} placeholder="Bearbeiter auswählen" />
                        </Form.Item>

                        <Form.Item
                            label="Status"
                            name="status"
                            initialValue="Offen"
                            rules={[{ required: true, message: 'Bitte einen Status wählen.' }]}
                        >
                            <Select options={statusOptionen} />
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
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    )
}

export default Projektdetail