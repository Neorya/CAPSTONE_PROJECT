import React from 'react';
import { Button, Space, Tooltip, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { 
  // ... altre icone che già usi
  PlayCircleOutlined 
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom'; // Necessario per il reindirizzamento
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
  return (
    
    <Space size="small">
      {session.is_active && (
        <Tooltip title="Go to Active Game">
          <Button
            type="primary"
            icon={<PlayCircleOutlined />} // Assicurati di importarlo da @ant-design/icons
            onClick={() => navigate(`/pre-start-game-session/${session.game_id}`)} // Cambia il path secondo le tue rotte
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} // Colore verde per indicare "attivo"
          />
        </Tooltip>
      )}
      <Tooltip title="View Details">
        <Button
          icon={<EyeOutlined />}
          onClick={() => onView(session)}
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
          />
        </Popconfirm>
      </Tooltip>

      <Tooltip title="Edit Session">
        <Button
          icon={<EditOutlined />}
          onClick={() => onEdit(session)}
          style={{ color: '#1890ff', borderColor: '#1890ff' }}
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
          />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
};

export default SessionActionButtons;

