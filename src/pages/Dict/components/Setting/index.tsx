import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Button, Input, Space, Card, Typography, Divider, Col, Row } from 'antd';
import { CheckCircleOutlined, AppstoreOutlined, CalendarOutlined, DownloadOutlined, EyeOutlined, EyeInvisibleOutlined, ThunderboltOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Setting() {
  // State for form values
  const [apiUrl, setApiUrl] = useState('http://localhost:11434');
  const [apiToken, setApiToken] = useState('sk-xxxxxxxxxxxxxxxxxxxxxxxx');
  const [showToken, setShowToken] = useState(false);
  const [dailyNewWords, setDailyNewWords] = useState(10);
  const [dailyReviewWords, setDailyReviewWords] = useState(50);

  const handleTestConnection = () => {
    console.log('Testing connection with:', { apiUrl, apiToken });
    // Add connection test logic here
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', {
      apiUrl,
      apiToken,
      dailyNewWords,
      dailyReviewWords
    });
    // Add save logic here
  };

  const handleResetDefaults = () => {
    setApiUrl('http://localhost:11434');
    setApiToken('');
    setDailyNewWords(10);
    setDailyReviewWords(50);
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.contentContainer}>
        <div style={styles.headerSection}>
          <div style={styles.titleContainer}>
            <Title level={2} style={styles.title}>Settings</Title>
            <Text style={styles.subtitle}>Manage your AI connection and study habits</Text>
          </div>
          <Space align="center">
            <div style={styles.statusBadge}>
              <CheckCircleOutlined style={{ marginRight: 4 }} />
              System Operational
            </div>
          </Space>
        </div>

        <div style={styles.formSections}>
          {/* AI Configuration Section */}
          <Card
            title={
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>AI Configuration</span>
                <AppstoreOutlined style={styles.sectionIcon} />
              </div>
            }
            style={styles.card}
            bodyStyle={styles.cardBody}
          >
            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>
                <Text strong>AI API URL</Text>
              </div>
              <Input
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="e.g., http://localhost:11434"
                style={styles.inputField}
              />
              <Text type="secondary" style={styles.helperText}>
                Point this to your local LLM server (e.g., Ollama) or OpenAI endpoint.
              </Text>
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputLabelWithBadge}>
                <Text strong>API Token</Text>
                <span style={styles.storedLocallyBadge}>Stored Locally</span>
              </div>
              <div style={styles.passwordContainer}>
                <Input.Password
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  placeholder="Enter your API token"
                  visibilityToggle={{
                    visible: showToken,
                    onVisibleChange: setShowToken
                  }}
                  iconRender={(visible) =>
                    visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
                  }
                  style={styles.inputField}
                />
              </div>
            </div>

            <Button
              type="default"
              onClick={handleTestConnection}
              icon={<ThunderboltOutlined />}
              style={styles.testButton}
            >
              Test Connection
            </Button>
          </Card>

          {/* Learning Goals Section */}
          <Card
            title={
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>Learning Goals</span>
                <CalendarOutlined style={styles.sectionIcon} />
              </div>
            }
            style={styles.card}
            bodyStyle={styles.cardBody}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} md={12}>
                <div style={styles.inputGroup}>
                  <div style={styles.inputLabel}>
                    <Text strong>Daily New Words Limit</Text>
                  </div>
                  <div style={styles.numberInputContainer}>
                    <Input
                      type="number"
                      value={dailyNewWords}
                      onChange={(e) => setDailyNewWords(Number(e.target.value))}
                      min={0}
                      style={styles.numberInput}
                      suffix="words / day"
                    />
                  </div>
                  <Text type="secondary" style={styles.helperText}>
                    Adding too many new words can overwhelm your review queue. We recommend 10-20 for sustainable learning.
                  </Text>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div style={styles.inputGroup}>
                  <div style={styles.inputLabel}>
                    <Text strong>Daily Review Words Limit</Text>
                  </div>
                  <div style={styles.numberInputContainer}>
                    <Input
                      type="number"
                      value={dailyReviewWords}
                      onChange={(e) => setDailyReviewWords(Number(e.target.value))}
                      min={0}
                      style={styles.numberInput}
                      suffix="words / day"
                    />
                  </div>
                  <Text type="secondary" style={styles.helperText}>
                    The maximum number of cards you want to review in a single session.
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Data Management Section */}
          <Card
            style={{ ...styles.card, ...styles.dataManagementCard }}
            bodyStyle={styles.cardBody}
          >
            <div style={styles.dataManagementContent}>
              <div>
                <Title level={4} style={styles.dataManagementTitle}>Data Management</Title>
                <Text type="secondary">Export your dictionary or clear cached data.</Text>
              </div>
              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={() => console.log('Exporting JSON')}
              >
                Export JSON
              </Button>
            </div>
          </Card>
        </div>

        <Divider style={styles.stickyDivider} />

        <div style={styles.footerActions}>
          <Button
            type="link"
            onClick={handleResetDefaults}
            style={styles.resetButton}
          >
            Reset to Defaults
          </Button>
          <Button
            type="primary"
            onClick={handleSaveChanges}
            icon={<SaveOutlined />}
            style={styles.saveButton}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  mainContainer: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#1a1b26',
    color: '#c0caf5',
    fontFamily: 'Inter, sans-serif',
    padding: '24px',
    overflow: 'auto',
  },
  contentContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '24px',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '24px',
    borderBottom: '1px solid #414868',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  titleContainer: {
    minWidth: '288px', // Min-width equivalent to 'min-w-72'
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    margin: 0,
    color: '#c0caf5',
    fontSize: '24px',
    fontWeight: '900',
    lineHeight: 1.2,
  },
  subtitle: {
    color: '#787c99',
    fontSize: '16px',
    fontWeight: 'normal',
  },
  statusBadge: {
    padding: '4px 12px',
    backgroundColor: 'rgba(158, 206, 106, 0.1)',
    color: '#9ece6a',
    fontSize: '12px',
    fontWeight: '500',
    borderRadius: '9999px',
    border: '1px solid rgba(158, 206, 106, 0.2)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  formSections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: '#24283b',
    borderRadius: '8px',
    border: '1px solid #414868',
    overflow: 'hidden',
  },
  cardBody: {
    padding: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#c0caf5',
    lineHeight: '1.3',
  },
  sectionIcon: {
    color: '#787c99',
    fontSize: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '24px',
  },
  inputLabel: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingBottom: '8px',
  },
  inputLabelWithBadge: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingBottom: '8px',
    width: '100%',
  },
  storedLocallyBadge: {
    fontSize: '12px',
    backgroundColor: '#16161e',
    color: '#787c99',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid #414868',
  },
  passwordContainer: {
    position: 'relative',
  },
  inputField: {
    height: '48px',
    borderRadius: '4px',
    border: '1px solid #414868',
    backgroundColor: '#16161e',
    color: '#c0caf5',
    fontSize: '16px',
    fontWeight: 'normal',
    padding: '0 16px',
  },
  numberInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  numberInput: {
    width: '150px',
    height: '48px',
    borderRadius: '4px',
    border: '1px solid #414868',
    backgroundColor: '#16161e',
    color: '#c0caf5',
    fontSize: '16px',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  helperText: {
    fontSize: '14px',
    lineHeight: '1.5',
  },
  testButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '4px',
    backgroundColor: '#16161e',
    border: '1px solid #414868',
    color: '#c0caf5',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 16px',
  },
  dataManagementCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
  },
  dataManagementContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dataManagementTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#c0caf5',
  },
  stickyDivider: {
    marginTop: '40px',
    marginBottom: '24px',
    borderColor: '#414868',
  },
  footerActions: {
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
    marginTop: '40px',
    marginLeft: '-24px',
    marginRight: '-24px',
    padding: '16px 24px',
    backgroundColor: 'rgba(22, 22, 30, 0.8)', // bg-white/80 dark:bg-background-dark/95
    backdropFilter: 'blur(20px)', // backdrop-blur-md
    borderTop: '1px solid #414868',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '16px',
  },
  resetButton: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#787c99',
  },
  saveButton: {
    minWidth: '120px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '4px',
    backgroundColor: '#7aa2f7', // primary blue
    border: '1px solid #7aa2f7',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700', // bold
    padding: '12px 24px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  },
};
