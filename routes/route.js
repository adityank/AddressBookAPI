/*
 * Author: Aditya Kamble
 * September 2018
 *
 * Handles different requests received like post,get,put,delete in context of addressbook and sends response as a json.
 *
 */


// Dependencies
var elasticsearch = require('elasticsearch');
var express= require('express');
var router= express.Router();

bodyParser = require('body-parser');

// Elasticsearch configure
var client = new elasticsearch.Client({
	host: 'localhost:9200',      
});

var indexName = 'addressbook'  

// Default route and initialize the mapping of JSON fields
router.get('/', function(req, res) {
	return client.indices.putMapping({  
		index: indexName,
		type: "contact",
		body: {
			properties: {
			name: {type: "text"},
			lastname: {type: "text"},
			phone: { type: "text","index_prefixes" : {
				"min_chars" : 10,    
				"max_chars" : 10    
			}}, 
			email: {type: "text" },
			address: {type: "text"} 
			}
		}
		}, function(err, response){
			if(err){
				console.log(err);
				res.sendStatus(500);
			}
			else{
				res.status(200).send({ message: 'Address Book API' }); 
			}
	});
});

// GET contact details of name
router.route('/contact/:name')
.get( function(req, res) {
	var input = req.params.name;

	client.search({       //searching the elasticsearch index
		index: indexName,
		type: 'contact',
		body: {
			query: {
				query_string:{
					query: input // the query string is the name of the contact
				}
			}
		}
	}).then(function (resp) {
		var results = resp.hits.hits.map(function(hit){
			return hit._source;
		});
		console.log('GET results',results); //returns the list of the search
		console.log(resp.hits.total);
		res.status(200).send(results);
	});
});

// GET list of all contacts
router.route('/contact')
.get(function(req, res) {

	var pageNum, perPage, userQuery;

	if(req.query.page == null){
		pageNum = 1;
	}
	else{
		pageNum = parseInt(req.query.page);
	}

	if(req.query.pageSize == null){
		perPage = 10;
	}
	else{
		perPage = parseInt(req.query.pageSize);
	}

	if(req.query.query == null){   
		userQuery = "{\"query\": {\"match_all\": {} }}";  
	}
	else{
		userQuery = parseInt(req.query.query);
	}

	var searchParams = {
		index: indexName,
		from: (pageNum - 1) * perPage,
		size: perPage,
		body: userQuery
	};

	console.log('search parameters', searchParams);
	client.search(searchParams, function (err, resp) {
		if (err) {
			throw err;
		}
		console.log('search_results', {
			results: resp.hits.hits,
			page: pageNum,
			pages: Math.ceil(resp.hits.total / perPage)
		});
		var results = resp.hits.hits.map(function(hit){
			return hit._source.name + " " + hit._source.lastname;
		});
		console.log(results);
		res.status(200).send(results);
	});
});
  

// POST request to insert new contact
router.route('/contact')  
.post(function(req, res) {

	var input = req.body;

	//check for unique name
	client.search({     
		index: indexName,
		type: 'contact',
		body: {
			query: {
				query_string:{
					query: input.name 
				}
			}
		}
	}).then(function (resp) {
	var results = resp.hits.hits.map(function(hit){
		return hit._source;
	});

	if(resp.hits.total > 0){
		res.status(409).send("Already exists!");
		return;
	}
	else{
		client.index({           
			index: indexName,
			type: 'contact',
			body: {
				name: input.name, 
				lastname: input.lastname,
				email: input.email,
				phone: input.phone,
				address: input.address
			}
		}, function (error,response) {
		if(error) 
			return console.log('ERROR',error);
		else{
			console.log(response);
			res.sendStatus(200);
		}
		});
	}
	});
}); 

// PUT request to update contact
router.route('/contact/:name')
.put(function(req, res) {

	client.updateByQuery({ 
		index: indexName,
		type: 'contact',
		body: { 
			"query": { "match": { "name": req.params.name } }, 
			"script":  "ctx._source.name =  "+ "'"+req.body.newname +" ' "+";" 
		}
	}, function(err, response) { 
		if (err) { 
			console.log(err);
			res.sendStatus(500);
		} 
		console.log(response);
		res.status(200).send(response);
	}
	)
});



// DELETE a contact
router.route('/contact/:name')
.delete(function(req, res) {
	input = req.params.name;
	client.deleteByQuery({
		index: indexName,
		type: 'contact',
		body: {
			query: {
			match: { name: input }
			}
		}
	}, function (error, response) {

		if(error){
			console.log(error);
			res.sendStatus(500);
		}

		else{
			res.status(200).send(response);
		}          
	});    	 
});

module.exports = router;