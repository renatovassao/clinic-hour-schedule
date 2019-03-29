# Clinic Hour Schedule API

This is an example API that organizes a clinic's hour schedule.

## Installation

Use the Node.js package manager [npm](https://www.npmjs.com/) to install.

```bash
npm install
```

## Usage

```bash
node bin/www
```

Then make requests to localhost:3000/rules and localhost:3000/hours.

## Examples

This request will create a rule
```bash
curl -H 'Content-Type: application/json' -d '{"rule_type":"ONE_DAY", "day":"28-03-2019", "intervals":[{"start":"11:00","end":"13:00"}]}' localhost:3000/rules
```

and this will show all the rules

```bash
curl localhost:3000/rules
```

Or you can use import this postman collection the see all the examples: https://www.getpostman.com/collections/4c39d650563bf933ccfe

## Documentation

[apiDoc](http://apidocjs.com/) was used to document this API, and you can see it in localhost:3000/doc

## Tests

To run unit tests

```bash
npm test
```
