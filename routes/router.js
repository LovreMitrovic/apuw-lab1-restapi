const router = require('express').Router();
const userController = require('../controllers/user.controller');
const usersController = require('../controllers/users.controller');
const barkController = require('../controllers/bark.controller');
const barksController = require('../controllers/barks.controller');
const { setUpUser, isLoggedIn } = require('../middlewares/isLogged');
const {bidAndUsername, bidOnly} = require('../middlewares/filters');

router.use(setUpUser)
router.use(isLoggedIn)


router.get('/users/:username',userController.getUser);
router.post('/users/:username', function(req,res,next){
    res.locals.recipient = req.params.username;
    next();
},barksController.postBarks);
router.put('/users/:username', userController.putUser);
router.delete('/users/:username', userController.deleteUser);

router.get('/users',usersController.getUsers);
router.post('/users', usersController.postUser);

router.get('/barks',  function (req, res, next){
    res.locals.filter = {};
    next();
},barksController.getBarks);
router.post('/barks', function(req,res,next){
    res.locals.recipient = req.body.recipient;
    next();
},barksController.postBarks);

router.get('/barks/:bid',bidOnly,barkController.getBark);
router.put('/barks/:bid', bidOnly,barkController.putBark);
router.delete('/barks/:bid', bidOnly,barkController.deleteBark);


router.get('/users/:username/barks', function (req, res, next){
    res.locals.filter = {recipient: req.params.username};
    next();
},barksController.getBarks);
router.post('/users/:username/barks', function(req,res,next){
    res.locals.recipient = req.params.username;
    next();
},barksController.postBarks);

router.get('/users/:username/barks/:bid', bidAndUsername,barkController.getBark);
router.put('/users/:username/barks/:bid', bidAndUsername,barkController.putBark);
router.delete('/users/:username/barks/:bid', bidAndUsername,barkController.deleteBark);


module.exports = router;