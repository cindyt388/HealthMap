/* 
This component is the sidebar component of the search page
	Children:
		Filter lists
		Distance slider
*/

import React, { useState }  from 'react';
import CheckListForm from './CheckListForm.js';
import Divider from '@material-ui/core/Divider';
import Slider from '@material-ui/core/Slider';
import styles from './filterList.module.css';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


//is there a better way to do this rather than hardcoding??
const options = {
	"Services" : [
		{ label: "Primary Care", name: "primaryCare" },
		{ label: "Mental Health", name: "mentalHealth"},
		{ label: "Immunizations", name: "immunizations"}
	],
	"Insurance & Payment" : [
		{ label: "Medicare", name: "medicare" },
		{ label: "Medi-Cal", name: "medi-cal"},
		{ label: "My Health LA", name: "mlha"}
	],
	"Languages" : [
		{ label: "English", name: "english" },
		{ label: "Cantonese", name: "cantonese" },
		{ label: "Mandarin", name: "mandarin" },
	]

}

let distances = [];
for (let i = 5; i <= 25; i += 5) {
	distances.push(<MenuItem value={i}>{i} miles</MenuItem>);
}

export default function FilterList (props) {
	const [distance, setDistance] = useState(props.distance);
	{/*** Creating the check list of filters} ***/}
	let filters = [];
	for (const key of Object.keys(options)) {
		filters.push(
			<div className = {styles.filterMenus}>
			<CheckListForm filterName = {key} 
				       options = {options[key]} 
				       onChange = {props.onChange}
				       onClick = {props.openModal(key)}		   
			/>
			<Divider />
			</div>
		);
	}
	{/*** finish creating checklist of filters ***/}


	return (
		<div className = {styles.filters}>	
		    <h3 id = {styles.filterTitle}>Filters</h3>
			{/*** distance selection begin ***/}
			<div className={styles.distance}>
			    <Typography id="discrete-slider" gutterBottom>
			        Distance
			    </Typography>

			    <Select value={distance}
				    onChange={props.onDistanceChange}>
				    {distances}
			    </Select>
			</div>
			{/*** end distance selection ***/}

			{/*** rest of the filters ***/}
			{filters}	
			{/*** end rest of filters ***/}
		</div>
	)	
}


