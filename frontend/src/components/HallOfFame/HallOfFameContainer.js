import React, { useState, useEffect, useRef, useCallback } from 'react';
import { message } from 'antd';
import { getLeaderboard } from '../../services/leaderboardService';
import HallOfFameView from './HallOfFameView';
import './HallOfFame.css';
import { getUserProfile } from '../../services/userService';

const DEFAULT_PAGE_SIZE = 10;

const HallOfFameContainer = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentUserRank, setCurrentUserRank] = useState(null);
    const [currentStudentId, setCurrentStudentId] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const pageSize = DEFAULT_PAGE_SIZE;

    const tableRef = useRef(null);

    const fetchLeaderboard = useCallback(async (page) => {
        setLoading(true);
        try {
            const data = await getLeaderboard(page, pageSize, currentStudentId);
            setLeaderboardData(data.leaderboard);
            setTotalStudents(data.total_students);
            setTotalPages(data.total_pages);
            console.log(data);
            setCurrentUserRank(data.current_user_rank);
            const dataProf = await getUserProfile();
            setCurrentStudentId(dataProf.user_id);
        } catch (error) {
            message.error(`Failed to load leaderboard: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [currentStudentId, pageSize]);

    useEffect(() => {

        fetchLeaderboard(currentPage);
    }, [currentPage, fetchLeaderboard]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleWhereAmI = () => {
        if (!currentUserRank) {
            message.info('Your rank information is not available');
            return;
        }

        const userPage = Math.ceil(currentUserRank.rank / pageSize);

        if (userPage !== currentPage) {
            setCurrentPage(userPage);
            message.info(`Navigating to page ${userPage}...`);
        } else {
            if (tableRef.current) {
                tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            message.info('You are on this page!');
        }
    };

    const renderRank = (rank, user) => {
        console.log("score ", user.score);
        if (user.score > 0 && user.rank <= 3)
            switch (user.rank) {
                case 1: return <span className="medal gold" data-testid="medal-gold">🥇</span>;
                case 2: return <span className="medal silver" data-testid="medal-silver">🥈</span>;
                case 3: return <span className="medal bronze" data-testid="medal-bronze">🥉</span>;
            }
        else
            return <span className="rank-number" data-testid="rank-number"> NO MEDAL </span>;
    };

    const columns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center',
            render: renderRank,
        },
        {
            title: 'Player',
            dataIndex: 'username',
            key: 'username',
            render: (text) => (
                <div className="player-info" data-testid="player-info">
                    <span className="player-name" data-testid="player-name">{text}</span>
                </div>
            ),
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            width: 150,
            align: 'right',
            render: (score) => <span className="hall-of-fame-score" data-testid="score-value">{score.toFixed(2)}</span>,
        },
    ];

    const pagination = {
        current: currentPage,
        pageSize: pageSize,
        total: totalStudents,
        onChange: handlePageChange,
        showSizeChanger: false,
        showTotal: (total) => `Total ${total} students`,
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <HallOfFameView
            columns={columns}
            leaderboardData={leaderboardData}
            loading={loading}
            pagination={pagination}
            currentStudentId={currentStudentId}
            currentUserRank={currentUserRank}
            handleWhereAmI={handleWhereAmI}
            tableRef={tableRef}
            isDrawerOpen={isDrawerOpen}
            toggleDrawer={toggleDrawer}
        />
    );
};

export default HallOfFameContainer;
