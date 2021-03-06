const express = require('express');
const router = express.Router();
const axios = require('axios');
const { pool } = require('./database.js');
const { constructQuery } = require('./query.js');
require('dotenv').config()

router.use(express.json());

router.get('/searchClinics/address=:address&distance=:distance', function (req, res) {
	let geoapi = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.address}&key=${process.env.GOOGLE_MAPS_API}`;

	axios.get(geoapi).then(function (response, body) {
		if (response.status== 200) {
			let geocoord = response.data.results[0].geometry.location;		//holding tuple of geocoords
			let address = response.data.results[0].formatted_address;
			//TODO
			//Offensive coding: Make sure we get a "valid response"
			//Check for inputs, no street address etc., display the numbers correctly by searching for
			//numbers in the query.
			console.log(req.params.distance);
			let query = constructQuery(geocoord.lat, geocoord.lng, req.body.filter, req.params.distance);
			console.log(query);
			pool.query(query, function(err, rows) {
				if (err)
				    throw err;
				
				let re = {
				    rows : rows,
				    geocoord : [geocoord.lng, geocoord.lat],
				    address: address,
				}
				console.log(re);
				res.send(re);				
			});	
		}
	});
});

router.post('/filterClinics', function(req, res) {
	console.log(req.body)
	let query = constructQuery(req.body.geocoord[1], req.body.geocoord[0], req.body.filter, req.body.distance);
	console.log(query);
	pool.query(query, function(err, rows) {

		if (err)
			throw err;
		console.log(rows);
		let re = {
			rows: rows
		}
		res.send(re);
	})
});

router.get('/getClinicData/:clinic', function(req, res) {
	console.log(req.params);
	let query1 = `SELECT address, state, city, zipcode, phone, day_of_week, hour_open, hour_close, latitude, longitude`+ 
	` FROM ClinicAddress INNER JOIN ClinicHours ON ClinicHours.clinic = ClinicAddress.clinic ` +
	`INNER JOIN ClinicCoords ON ClinicCoords.clinic = ClinicAddress.clinic`+
	` WHERE ` + 
	`ClinicHours.clinic = '${req.params.clinic}';`
	console.log(query1);
	let query2 = `SELECT treatment from ClinicTreatment WHERE clinic = '${req.params.clinic}';`;

	let query3 = `SELECT language from ClinicLanguage WHERE clinic= '${req.params.clinic}';`;

	let query4 = `SELECT insurance from ClinicInsurance WHERE clinic = '${req.params.clinic}';`;
	pool.query( query1 +  query2 + query3 + query4, function(err, rows) {
		if (err)
			throw err;

		console.log(rows);	
		let re = {
			rows: rows[0],
			treatment: rows[1],
			language: rows[2],
			insurance: rows[3]
		};
		res.send(re);
	})
});	

//get endpoint, for all clinics
router.get("/getData", function(req, res) {
	let query = "SELECT clinic FROM ClinicAddresses;"

	pool.query(query, function(err, rows) {
		if (err) 
			throw err;

		console.log(rows);
		res.send(rows);
	});
});

module.exports = router;
