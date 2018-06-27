## API Documentation
### Customer  
Base Route: https://hsro.dev:3443/customer  
Routes:
* GET / => Lists all customers
* GET /?QUERY => Lists all customers depending on query
    * Possible fields: addressRef, birthday, customerNumber, firstname, lastname
    * Examples: /find?addressRef=[hash], /find?firstname=Stefan&lastname=Kürzeder (multiple fields can be combined)
* GET /:[hash] => Responds with the customer with matching id
* POST / => Creates a new customer, fields are the same as in FIND
    * Fields have to be send in the body "x-www-form-urlendcoded"
* DELETE /:[hash] => Deletes the customer with matching id
* PATCH /:[hash] => Updates the given fields 
    * see CREATE for additional information on fields
* PUT: /:[customerHash]/insurance/:[insuranceHash] => Adds the given insurance to the customer
* DELETE: /:[customerHash]/insurance/:[insuranceHash] => Removes the given insurance from the customer

### Insurance  
Base Route: https://hsro.dev:3443/insurance  
Routes:
* GET / => Lists all insurances
* GET /?QUERY => Lists all insurances depending on query
    * Possible fields: annualRate, contractNumber, type
    * Examples: /find?contractNumber=1234, /find?type=KFZ&annualRate=1000 (multiple fields can be combined)
* GET /:[hash] => Responds with the insurance with matching id
* POST / => Creates a new insurances, fields are the same as in FIND
    * Fields have to be send in the body "x-www-form-urlendcoded"
* DELETE /:[hash] => Deletes the insurances with matching id
* PATCH /:[hash] => Updates the given fields 
    * see CREATE for additional information on fields
