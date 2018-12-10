## Usage

An endpoint that can be used to integrate Taxjar tax service with Moltin.

- You will need to have your Moltin and TaxJar keys

- The package is deployed via Serverless. If you do not have Serverless please go read their documentation to get started https://serverless.com/. Note you could create the APIGateway and Lambda in the Dashboard if you would like.

* Install packages

```
npm install
```

- Adding keys

```
//handler.js
var taxJar = require("taxjar")("XXXXX");
//Your Moltin Keys
const Moltin = new MoltinClient({
  client_id: "XXXXX",
  client_secret: "XXXXX"
});
```

- Deploying

```
sls deploy
```

Running sls deploy will deploy the APIGateway and the lambda in this package.

- Usage
  Tax are generally calculated at the time the user informs of the shipping location. At this point you can then send the shipping location and the cartId to the APIEndpoint that was created.

This will fetch the tax rate for the users location, then add the amount to the users cart as a custom item and return the amount in the response. This response can then be to the user as the tax amount that will be applied.

- Testing
  In the playground folder you will fine a basic cart that can be used to test the endpoint and observe the API behavior.
