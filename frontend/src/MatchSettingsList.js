import React, { useState } from 'react';
import './css/MatchSettingsList.css'

const macthSettingsList = [
	{ name: 'Exemple 1', status: 'ready' },
	{ name: 'Exemple 2', status: 'draft' },
	{ name: 'Exemple 3', status: 'ready' },
	{ name: 'Exemple 4', status: 'draft' },
	{ name: 'Exemple 5', status: 'ready' },
];

function MatchSettingsList() {
	const [filter, setFilter] = useState('all');

	const filteredItems = macthSettingsList.filter(item => {
		if (filter === 'all') {
			return true;
		}
		return item.status === filter;
	});

	return (
		<div>
			<h1>Match Setting List</h1>

			<div id="fileterButtons">
				<button onClick={() => setFilter('all')}>All</button>
				<button onClick={() => setFilter('ready')}>Ready</button>
				<button onClick={() => setFilter('draft')}>Draft</button>
			</div>


			<table id="matchSettingsListTable">
				<thead>
					<tr>
						<th>Name</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{filteredItems.map(item => (
						<tr key={item.name}>
							<td>{item.name}</td>
							<td><strong>{item.status}</strong></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default MatchSettingsList;
