const recurly = require('recurly');

let recurlyClient;

function getRecurlyNewClient() {
  if(!recurlyClient) {
    recurlyClient = new recurly.Client(process.env.RECURLY_PRIVATE_KEY);
  }
  return recurlyClient;
}

module.exports = {getRecurlyNewClient}