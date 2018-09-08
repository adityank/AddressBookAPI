
/*
 * Author: Aditya Kamble
 * September 2018
 *
 * A unit-test script checking all the REST API specifications
 *
 */



var should = require('chai').should(),
expect = require('chai').expect,
supertest = require('supertest'),
api = supertest('http://localhost:8080');


describe('Contact', function(){


	//Before testing check if index exists
	it('Index exists',  function(response){
		api.get('/')
		.set('Accept', 'application/json')
		.expect(200,response);
	});


	it('POST a new contact',  function(response){
		api.post('/contact/')
	    .set('Accept', 'application/json')
	    .send({
		     name: "Adi",
		     lastname: "Kamble",
		     address: "Pitt",
		     email: "adit@cmu.edu",
		     phone: "1234567890"
	    })
	    .expect(200,response);
	});

	it('Waiting for POST to complete', function(done){
      	setTimeout(function(){
        	console.log('done');
           	done();
       		}, 1100)
   	})

	it('POST an existing contact',  function(response){
		console.log(response);
		api.post('/contact/')
	    .set('Accept', 'application/json')
	    .send({
		     name: "Adi",
		     lastname: "Kamble",
		     address: "Pitt",
		     email: "adit@cmu.edu",
		     phone: "1234567890"
	    })
	    .expect(409,response);
	});

	
	it('Verifying Contact details', function(response) {
	    api.get('/contact/Adi')
	    .set('Accept', 'application/json')
	    .expect(200)
	    .end(function(err, res) {
	      	expect(res.body).to.include.deep.members( [{ name: 'Adi',
    		lastname: 'Kamble',
    		address: 'Pitt',
    		email: 'adit@cmu.edu',
    		phone: '1234567890'
    		 }] );
 	      	response();
    	});

  	});

	it('Update an existing Contact', function(response) {
	    api.put('/contact/Adi')
	    .set('Accept', 'application/json')
	    .send({newname: 'Adit'})
	    .expect(200,response);
	 });

	
	it('Get all contacts', function(response) {
	    api.get('/contact')
	    .set('Accept', 'application/json')
	    .send({
		     pageSize: "1",
		     pageNum: "2",
		     query: "test",
		    })
	    .expect(200,response);
	 });

	it('Delete an existing contact', function(response) {
	    api.delete('/contact/Adit')
	    .set('Accept', 'application/json')
	    .send()
	    .expect(200,response);
	 });


}); 

