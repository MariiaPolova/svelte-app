import {v4 as uuid} from 'uuid';

export default (url) => {
    return (req, res, next) => {
        if(req.url === url){
            res.cookie('csrfToken', uuid());
        }

        next();
    }
}