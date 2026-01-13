import { Table, Card, Typography, Button } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import FloatingRankButton from './FloatingRankButton';

const { Text } = Typography;

const LeaderboardTable = ({
    columns,
    dataSource,
    loading,
    pagination,
    rowKey,
    rowClassName,
    tableRef,
    handleWhereAmI,
    currentUserRank,
    toggleDrawer
}) => (
    <div className="leaderboard-section" ref={tableRef} id="leaderboard-section">
        <Card
            className="leaderboard-card"
            id="leaderboard-card"
            title={
                <div className="table-header-container" id="table-header-container">
                    <span id="rankings-title">Rankings</span>
                    <div className="header-actions" id="header-actions">
                        <Button
                            icon={<EnvironmentOutlined />}
                            onClick={handleWhereAmI}
                            size="small"
                            className="quick-find-button"
                            id="where-am-i-button"
                        >
                            Where Am I?
                        </Button>
                        <FloatingRankButton
                            onClick={toggleDrawer}
                            currentUserRank={currentUserRank}
                        />
                    </div>
                </div>
            }
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={pagination}
                rowKey={rowKey}
                rowClassName={rowClassName}
                id="leaderboard-table"
            />
            <div className="motivational-message" id="motivational-message">
                <Text type="secondary">Keep pushing! You're close to the top!</Text>
            </div>
        </Card>
    </div>
);

export default LeaderboardTable;


