import React from 'react';
import LeaderboardHeader from './components/LeaderboardHeader';
import LeaderboardTable from './components/LeaderboardTable';
import UserRankCard from './components/UserRankCard';

const HallOfFameView = ({
    columns,
    leaderboardData,
    loading,
    pagination,
    currentStudentId,
    currentUserRank,
    handleWhereAmI,
    tableRef,
    isDrawerOpen,
    toggleDrawer
}) => {
    return (
        <div className="hall-of-fame-container" id="hall-of-fame-container">
            <LeaderboardHeader />

            <div className="hall-of-fame-content" id="hall-of-fame-content">
                <LeaderboardTable
                    columns={columns}
                    dataSource={leaderboardData}
                    loading={loading}
                    pagination={pagination}
                    rowKey="student_id"
                    rowClassName={(record) => record.student_id === currentStudentId ? 'current-user-row' : ''}
                    tableRef={tableRef}
                    handleWhereAmI={handleWhereAmI}
                    currentUserRank={currentUserRank}
                    toggleDrawer={toggleDrawer}
                />
            </div>

            <UserRankCard
                currentUserRank={currentUserRank}
                handleWhereAmI={handleWhereAmI}
                isOpen={isDrawerOpen}
                onClose={toggleDrawer}
            />
        </div>
    );
};

export default HallOfFameView;

