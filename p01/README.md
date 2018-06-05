## API Documentation
### Customer  
Base Route: https://hsro.dev/customer  
Routes:
* GET /find => Lists all customers
* GET /find?QUERY => Lists all customers depending on query
    * Possible fields: addressRef, birthday, customerNumber, firstname, lastname
    * Examples: /find?addressRef=[hash], /find?firstname=Stefan&lastname=Kürzeder (multiple fields can be combined)
* GET /:[hash] => List customer with matching id
* POST /create => Creates a new customer, fields are the same as in /find?QUERY
    * Fields have to be send in the body "x-www-form-urlendcoded"
* DELETE /:[hash] => Deletes the customer with matching id
* PATCH /:[hash] => Updates the given fields 
    * see "POST /create" for additional info on fields

### Insurance  
Base Route: https://hsro.dev/insurance  
Routes:
* GET /find => Lists all insurances
* GET /find?QUERY => Lists all insurances depending on query
    * Possible fields: annualRate, contractNumber, type
    * Examples: /find?contractNumber=1234, /find?type=KFZ&annualRate=1000 (multiple fields can be combined)
* GET /:[hash] => List insurances with matching id
* POST /create => Creates a new insurances, fields are the same as in /find?QUERY
    * Fields have to be send in the body "x-www-form-urlendcoded"
* DELETE /:[hash] => Deletes the insurances with matching id
* PATCH /:[hash] => Updates the given fields 
    * see "POST /create" for additional info on fields
