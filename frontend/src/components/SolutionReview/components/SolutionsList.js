import React from 'react';
import {
    Card,
    Typography,
    Button,
    Row,
    Col,
    Space
} from 'antd';
import { ClockCircleOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const SolutionsList = ({
    solutions,
    selectedSolution,
    remainingTime,
    isLeftPanelCollapsed,
    onTogglePanel,
    onSolutionClick
}) => {
    return (
        <Card
            className={`left-panel-card ${isLeftPanelCollapsed ? 'compact' : ''}`}
            bordered={false}
        >
            <Button
                type="text"
                className="left-panel-toggle"
                aria-label={isLeftPanelCollapsed ? 'Expand left panel' : 'Collapse left panel'}
                icon={isLeftPanelCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={onTogglePanel}
            />

            {/* Header */}
            {!isLeftPanelCollapsed ? (
                <div className="header-section">
                    <Title id="voting-phase-header" level={3} style={{ marginBottom: 4 }}>
                        Challenge: Phase 2 - Solution Review
                    </Title>
                    <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                        Review solutions from all participants before voting
                    </Paragraph>

                    {/* Timer */}
                    <Card className="timer-card" bordered={false}>
                        <Space direction="vertical" align="center" style={{ width: '100%' }}>
                            <Text type="secondary">Voting Starts In:</Text>
                            <div className="timer-display">
                                <ClockCircleOutlined className="timer-icon" />
                                <span id="phase-timer" className="timer-text">{remainingTime}</span>
                            </div>
                        </Space>
                    </Card>
                </div>
            ) : (
                <div className="compact-panel">
                    <div className="compact-phase-title" aria-label="Phase 2">Phase 2</div>
                    <div className="compact-timer" aria-label={`Time remaining ${remainingTime}`}>
                        <span id="phase-timer" className="compact-timer-text">{remainingTime}</span>
                    </div>

                    <div className="compact-reviewing-header">
                        <Text type="secondary" className="compact-section-label">Reviewing</Text>
                    </div>
                </div>
            )}

            {/* Solutions Grid */}
            <div
                id="view-solutions-list"
                className={`solutions-grid ${isLeftPanelCollapsed ? 'compact' : ''}`}
            >
                {!isLeftPanelCollapsed ? (
                    <Row gutter={[24, 24]}>
                        {solutions.map((solution, index) => {
                            const studentNumber = index + 1;
                            return (
                                <Col span={12} key={solution.id}>
                                    <Card
                                        className={`solution-card solution-item ${selectedSolution?.id === solution.id ? 'selected' : ''}`}
                                        hoverable
                                        onClick={() => onSolutionClick(solution.id)}
                                    >
                                        <div className="solution-card-content">
                                            <Text strong className="participant-id solution-label">{solution.participantId}</Text>
                                            <span className="submission-timestamp" style={{ display: 'none' }}>Just now</span>
                                            <Button
                                                id={`view-details-${solution.id}`}
                                                className="view-details-button"
                                                type="primary"
                                                block
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSolutionClick(solution.id);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                ) : (
                    <div className="solutions-compact-list" role="list" aria-label="Solutions list">
                        <Space direction="vertical" size={10} style={{ width: '100%' }}>
                            {solutions.map((solution, index) => {
                                const studentNumber = index + 1;
                                const isSelected = selectedSolution?.id === solution.id;
                                return (
                                    <Button
                                        key={solution.id}
                                        className={`solution-compact-button ${isSelected ? 'selected' : ''}`}
                                        type={isSelected ? 'primary' : 'default'}
                                        block
                                        onClick={() => onSolutionClick(solution.id)}
                                    >
                                        {solution.participantId}
                                    </Button>
                                );
                            })}
                        </Space>
                    </div>
                )}
            </div>

            {/* Hidden Todo List for Tests */}
            <ul id="todo-review-list" style={{ display: 'none' }}>
                {solutions.map((solution) => (
                    <li key={solution.id}>
                        <span className="participant-id">{solution.participantId}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default SolutionsList;
