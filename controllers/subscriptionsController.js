const got = require('got');

exports.getInfoByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { expired } = req.query;
        const customer = await got(`${process.env.API_URL}/customers`, 
        {
            searchParams: {
                page_size: 10,
                login: id
            },
            username: process.env.API_BASE_USER_NAME,
            password: process.env.API_BASE_USER_PASSWORD,
            responseType: 'json', 
            resolveBodyOnly: true
        });
        const subscriptions = await getSubscriptions(customer.currentPagesEntities[0].id, expired);
        const collectedSubscriptions = subscriptions.map(sub => sub.currentPagesEntities);

        if(process.env.DEBUG_MODE === 'true') {
            console.info([].concat(...collectedSubscriptions));
        }
        res.status(200).send([].concat(...collectedSubscriptions));
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

getSubscriptions = async (id, includeExpired) => {
    const array = await getListOfOrdersById(id, includeExpired);
    if(process.env.DEBUG_MODE === 'true') {
        console.table(array)
    }
    const ordersPromises = array.map(item => getSubscriptionByOrderId(item.id));
    return Promise.all(ordersPromises);
}

getListOfOrdersById = async (customerId, includeExpired) => {
   const orders =  await got(`${process.env.API_URL}/orders`, 
    {
        searchParams: {
            interval: includeExpired === 'true' ? 'ANY' : 'ACTIVE',
            page_size: 1000,
            customer_id: customerId
        },
        username: process.env.API_BASE_USER_NAME,
        password: process.env.API_BASE_USER_PASSWORD,
        responseType: 'json', 
        resolveBodyOnly: true
    });
    if(orders.currentPagesEntities) {
        if(process.env.DEBUG_MODE === 'true') {
            console.info(orders.currentPagesEntities)
        }
        return orders.currentPagesEntities;
    }
}

getSubscriptionByOrderId = (orderId) => {
   return got(`${process.env.API_URL}/song_subscriptions/detailed`, 
    {
        searchParams: {
            order_id: orderId,
            page_size: 1000,
            include_expired: 'INCLUDE_EXPIRED',
            sort_prop: 'CREATION_DATE',
            sort_direct: 'ASCENDING'
        },
        username: process.env.API_BASE_USER_NAME,
        password: process.env.API_BASE_USER_PASSWORD,
        responseType: 'json', 
        resolveBodyOnly: true
    });
}

exports.getSubscriptionInfoBySongID = async (req, res) => {
    try {
        const { id } = req.params;
        const { expired } = req.query;
        const songSubscriptions = await got(`${process.env.API_URL}/song_subscriptions/detailed?`, 
        {
            searchParams: {
                page_size: 1000,
                song_id: id,
                include_expired: expired ? "INCLUDE_EXPIRED" : "EXCLUDE"
            },
            username: process.env.API_BASE_USER_NAME,
            password: process.env.API_BASE_USER_PASSWORD,
            responseType: 'json', 
            resolveBodyOnly: true
        });
       
        if(process.env.DEBUG_MODE === 'true') {
            console.info(songSubscriptions);
        }
        res.status(200).send(songSubscriptions);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}
