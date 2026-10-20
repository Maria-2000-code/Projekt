import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import logo from '../assets/IU Logo.png'
import { Alert, Button, Card, Flex, Form, Input, Typography, Layout } from 'antd'

const { Title } = Typography

function Login() {
    const [fehler, setFehler] = useState('')
    const [codeAbfragen, setCodeAbfragen] = useState(false)
    const otpRef = useRef(null)
    const navigate = useNavigate()
    
    const handleFinish = (werte) => {
        if (codeAbfragen) {
            navigate('/projekt')
            return
        }
        
        const zugangsdatenOK = true
        const zweiFaktorAktiv = true

        if (!zugangsdatenOK) {
            setFehler('Anmeldung fehlgeschlagen: Benutzername oder Passwort falsch.')
        } else if (zweiFaktorAktiv) {
            setFehler('')
            setCodeAbfragen(true)
        } else {
            navigate('/projekt')
        }
    }

    // Funktion, um den Fokus zu entziehen, sobald 6 Ziffern eingegeben sind
    const handleOtpChange = (value) => {
        if (value.length === 6) {
            setTimeout(() => {
                if (otpRef.current && typeof otpRef.current.blur === 'function') {
                    otpRef.current.blur()
                } else {
                    document.activeElement?.blur()
                }
            }, 0)
        }
    }
    
    return (
    <div className="login-seite">
        
        <div className="login-kopf">
            <img src={logo} alt="IU Logo" className="login-logo"/>
            <Title style={{ margin: 0}}>Aufgabenmanagementsystem</Title>
        </div>
        
        <Form layout="vertical" onFinish={handleFinish} autoComplete="off">
            <Flex gap={32} justify="center" align="stretch" wrap>
                
                <Card className="login-karte">
                    <Title level={2} style={{ textAlign: 'center', marginTop: 0 }}>
                        Anmelden
                    </Title>
                    <Form.Item
                        label="Benutzername"
                        name="benutzername"
                        rules={[{ required: true, message: 'Bitte Benutzername eingeben.' }]}>
                        <Input disabled={codeAbfragen} />
                    </Form.Item>
                    <Form.Item
                        label="Passwort"
                        name="passwort"
                        rules={[{ required: true, message: 'Bitte Passwort eingeben.'}]}>
                        <Input.Password disabled={codeAbfragen} />
                    </Form.Item>
                    {fehler && (
                        <Alert type="error" message={fehler} showIcon style={{ marginBottom: 16 }} />
                    )}
                    {!codeAbfragen && (
                        <Button type="primary" htmlType="submit" block>
                            Weiter
                        </Button>
                    )}
                </Card>
                
                {codeAbfragen && (
                    <Card className="login-karte">
                        <Title level={2} style={{ textAlign: 'center', marginTop: 0 }}>
                            Zwei-Faktor-Code
                        </Title>
                        <Form.Item
                            label="Code aus der Authenticator-App"
                            name="code"
                            rules={[{ required: true, message: 'Bitte den Code eingeben.' }]}>
                            <Input.OTP
                                ref={otpRef}
                                length={6}
                                formatter={(text) => text.replace(/\D/g, '')}
                                onChange={handleOtpChange}
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Weiter
                        </Button>
                    </Card>
                )}
            </Flex>
        </Form>
    </div>
    )
}
export default Login