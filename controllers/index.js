const router = require('express').Router();

const homeRoutes = require('./home-routes.js');

router.use('/', homeRoutes);


// for endpoints that don't exist 
router.use((req, res) => {
    res.status(404).end();
});
  
module.exports = router;