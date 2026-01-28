import React from 'react';
import { Button, Space, Tooltip, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  // ... altre icone che già usi
  PlayCircleOutlined
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom'; // Necessario per il reindirizzamento
import { getGameSessionDetails } from '../../../services/gameSessionService';


/**
 * SessionActionButtons - Action buttons for each session row
 * Provides view, clone, edit, and delete actions with confirmations
 * 
 * @param {Object} props
 * @param {Object} props.session - Session data for the row
 * @param {Function} props.onView - Callback for view action
 * @param {Function} props.onClone - Callback for clone action
 * @param {Function} props.onEdit - Callback for edit action
 * @param {Function} props.onDelete - Callback for delete action
 * @returns {JSX.Element} Action buttons group
 */

const SessionActionButtons = ({
  session,
  onView,
  onClone,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const started = session.actual_start_date !== null;

  return (

    <Space size="small">
      {
        (
          <Tooltip title="Go to Game Session">
            <Button
              type="primary"
              icon={<PlayCircleOutlined />} // Assicurati di importarlo da @ant-design/icons
              onClick={async () => {
                const data = await getGameSessionDetails(session.game_id);
                const started = !!data.actual_start_date;

                navigate(started
                  ? `/start-game-session/${session.game_id}`
                  : `/pre-start-game-session/${session.game_id}`
                );
              }}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} // Colore verde per indicare "attivo"
            />
          </Tooltip>
        )}
      <Tooltip title="View Details">
        <Button
          icon={<EyeOutlined />}
          onClick={() => onView(session)}
          data-testid="view-session-btn"
        />
      </Tooltip>

      <Tooltip title="Clone Session">
        <Popconfirm
          title="Clone Session"
          description="Are you sure you want to clone this session?"
          onConfirm={() => onClone(session)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            icon={<CopyOutlined />}
            style={{ color: 'rgba(0, 0, 0, 0.88)' }}
            data-testid="clone-session-btn"
          />
        </Popconfirm>
      </Tooltip>

      <Tooltip title="Edit Session">
        <Button
          icon={<EditOutlined />}
          onClick={() => onEdit(session)}
          style={{ color: '#1890ff', borderColor: '#1890ff' }}
          data-testid="edit-session-btn"
        />
      </Tooltip>

      <Popconfirm
        title="Delete Session"
        description="Are you sure you want to delete this session?"
        onConfirm={() => onDelete(session.game_id)}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <Tooltip title="Delete Session">
          <Button
            danger
            icon={<DeleteOutlined />}
            data-testid="delete-session-btn"
          />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
};

export default SessionActionButtons;

