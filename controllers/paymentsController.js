const {getRecurlyNewClient} = require('../config/paymentGatewayClient.js')

exports.getList = async (req, res) => {
    try {
      const client = getRecurlyNewClient();
      const {accountCode, state = 'live', num = '200'} = req.query;
      if (client) {
        const subscriptions = client.listAccountSubscriptions('code-' + accountCode, {limit: num, state});
        let subsArr = [];
        for await (let subscriptionsSet of subscriptions.eachPage()){
          subsArr.push(...subscriptionsSet.map(sub => ({ ...sub, plan: {...sub.plan, plan_code: sub.plan.code} })));
        }
  
        return res.status(200).send(subsArr);
      } else {
        return res.status(500).send('Recurly client is not defined');
      }
    } catch (error) {
        return res.status(400).send(error && error.message || 'Recurly client error');
    }
  
  }

  exports.getAccountById = async (req, res) => {
    try {
      const client = getRecurlyNewClient();
      const {accountCode} = req.params;
      
      if (client) {
        const user = await client.getAccount('code-' + accountCode);
        if(user) {
          return res.status(200).send({accountCode, email: user.email, name: user.firstName && `${user.firstName} ${user.lastName}` });
        }
      } else {
        return res.status(500).send('Recurly client is not defined');
      }
    } catch (error) {
        return res.status(400).send(error && error.message || 'Recurly client error');
    }
  
  }