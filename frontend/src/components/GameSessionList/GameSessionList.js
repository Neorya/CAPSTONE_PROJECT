import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Alert, Spin, Card, Typography, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGameSessions } from './hooks/useGameSessions';
import { useSessionModal } from './hooks/useSessionModal';
import SessionDetailModal from './components/SessionDetailModal';
import SessionActionButtons from './components/SessionActionButtons';
import { PAGINATION_CONFIG } from './constants';
import './GameSessionList.css';

const { Title, Text } = Typography;

/**
 * GameSessionList - Main component for displaying and managing game sessions
 * Orchestrates child components and custom hooks for state management
 * 
 * Architecture:
 * - Uses custom hooks for state management (useGameSessions, useSessionModal)
 * - Delegates UI rendering to presentational components
 * - Maintains single responsibility: orchestration only
 * 
 * @returns {JSX.Element} Game session list page
 */
const GameSessionList = () => {
  const navigate = useNavigate();

  // Alert state (inline for simplicity, can use useAlert hook if needed)
  const [error, setError] = React.useState(null);

  // Alert handlers
  const showAlert = useCallback((type, msg) => {
    if (type === 'error') {
      setError(msg);
    }
  }, []);

  const showSuccess = useCallback((msg) => {
    message.success(msg);
  }, []);

  // Custom hooks for state management
  const {
    sessions,
    loading,
    cloneSession,
    deleteSession,
    updateSession,
  } = useGameSessions(showAlert, showSuccess);

  const {
    isOpen,
    mode,
    selectedSession,
    sessionMatches,
    matchesLoading,
    form,
    openForView,
    openForEdit,
    switchToEdit,
    close,
    getFormValues,
    // New props for edit mode match selection
    allMatches,
    selectedMatchIds,
    allMatchesLoading,
    updateSelectedMatchIds,
    isFormValid,
  } = useSessionModal();

  /**
   * Handles modal save action
   */
  const handleModalSave = async () => {
    if (mode === 'view') {
      close();
      return;
    }

    try {
      const values = await getFormValues();
      const success = await updateSession(selectedSession.game_id, values);
      if (success) {
        close();
      }
    } catch (err) {
      // Form validation error - handled by Ant Design
      console.error('Form validation failed:', err);
    }
  };

  /**
   * Table columns configuration
   */
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <SessionActionButtons
          session={record}
          onView={openForView}
          onClone={cloneSession}
          onEdit={openForEdit}
          onDelete={deleteSession}
        />
      ),
    },
  ];

  return (
    <div className="game-session-list-container">
      <Card className="game-session-card" bordered={false}>
        {/* Page Header */}
        <div className="page-header">
          <Tooltip title="Back to Home">
            <Button
              id="back-to-home-button"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/home')}
              shape="circle"
              size="large"
              style={{ marginRight: 16 }}
            />
          </Tooltip>
          <div style={{ flex: 1 }}>
            <Title level={2} style={{ margin: 0 }}>Game Sessions</Title>
          </div>
        </div>

        {/* Subheader */}
        <div className="subheader">
          <Text type="secondary">
            Browse, clone, delete, view, or modify your created game sessions.
          </Text>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Sessions Table */}
        {loading && sessions.length === 0 ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={sessions}
            rowKey="game_id"
            pagination={PAGINATION_CONFIG}
            className="session-table"
            loading={loading && sessions.length > 0}
          />
        )}

        {/* Session Detail Modal */}
        <SessionDetailModal
          isOpen={isOpen}
          mode={mode}
          form={form}
          loading={loading}
          onSave={handleModalSave}
          onClose={close}
          onSwitchToEdit={switchToEdit}
          matches={sessionMatches}
          matchesLoading={matchesLoading}
          // Edit mode props for match selection
          allMatches={allMatches}
          selectedMatchIds={selectedMatchIds}
          allMatchesLoading={allMatchesLoading}
          onMatchSelectionChange={updateSelectedMatchIds}
          isFormValid={isFormValid()}
        />
      </Card>
    </div>
  );
};

export default GameSessionList;
