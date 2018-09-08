
---------------------------------------------------------------------------------------------------
Address book REST API
Aditya Kamble
Carnegie Mellon University
MSIT-SE 2018
---------------------------------------------------------------------------------------------------

Dependencies:
*	Node.js
*	Express
*	Mocha
*	Elasticsearch

---------------------------------------------------------------------------------------------------

Description:

*	GET 	- Get a list of all contacts
			- Get contacts by name
*	POST 	- Insert a new contact
*	PUT 	- Update a contact
*	DELETE 	- Delete a contact

---------------------------------------------------------------------------------------------------

Installation on Windows:

1. Download and install elasticsearch from https://www.elastic.co/downloads/elasticsearch
2. Start the elasticsearch server by running the <elaticsearch-installation-path>/bin/elasticsearch.bat in admin mode. 
3. Open a browser and go to http://localhost:9200 and you should see something like the following:
			{
			  "name" : "LOiYv9G",
			  "cluster_name" : "elasticsearch",
			  "cluster_uuid" : "inYsZSjwSqmNMFK1AQ73DA",
			  "version" : {
			    "number" : "6.4.0",
			    "build_flavor" : "default",
			    "build_type" : "zip",
			    "build_hash" : "595516e",
			    "build_date" : "2018-08-17T23:18:47.308994Z",
			    "build_snapshot" : false,
			    "lucene_version" : "7.4.0",
			    "minimum_wire_compatibility_version" : "5.6.0",
			    "minimum_index_compatibility_version" : "5.0.0"
			  },
			  "tagline" : "You Know, for Search"
			}

	If you cannot see this, reinstall elasticsearch properly.

4. Create an index for the app by running following command:
	curl -X PUT "localhost:9200/addressbook"
5. Clone this git repository / download and extract the .zip file. 
6. Open a command prompt from the root directory of this app and type
	npm install
7. Then start the app by typing the following in the command prompt:
	node server.js
8. Verify that you see "Starting AddressBook server on port 8080" on the command prompt and when you open http://localhost:8080 on the browser you see:
	{"message":"Address Book API"}


