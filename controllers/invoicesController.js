const {getRecurlyNewClient} = require('../config/paymentGatewayClient.js')

exports.getInvoicesList = async (req, res) => {
    try {
        const client = getRecurlyNewClient();
        const { accountCode } = req.params;
        const { num = '200'} = req.query;
        if (client) {
            const invoices = client.listAccountInvoices('code-' + accountCode, {limit: num });
            let invoicesArr = [];
            for await (let invoicesSet of invoices.eachPage()){
                invoicesArr.push(...invoicesSet.map(invoice => ({ ...invoice })));
            }

            return res.status(200).send(invoicesArr);
        } else {
            return res.status(500).send('Recurly client is not defined');
        }
    } catch (error) {
        return res.status(400).send(error && error.message || 'Recurly client error');
    }

}
