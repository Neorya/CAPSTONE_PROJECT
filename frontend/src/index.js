import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import MatchSettingsList from './MatchSettingsList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<MatchSettingsList />
	</React.StrictMode>
);

