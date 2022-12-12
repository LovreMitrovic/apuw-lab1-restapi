const router = require('express').Router();
const userController = require('../controllers/user.controller');
const usersController = require('../controllers/users.controller');
const barkController = require('../controllers/bark.controller');
const barksController = require('../controllers/barks.controller');
const { setUpUser, isLoggedIn } = require('../middlewares/isLogged');
const methodNotAllowed = require('../controllers/methodNotAllowed.controller');

router.use(setUpUser)
router.use(isLoggedIn)

router.get('/users/:username',userController.getUser);
//moguce je dodati post tu ide postBarks
router.put('/users/:username', userController.putUser);
router.delete('/users/:username', userController.deleteUser);

router.get('/users',usersController.getUsers);
router.post('/users', usersController.postUser);
router.put('/users', methodNotAllowed);
router.delete('/users', methodNotAllowed);

router.get('/barks', barksController.getBarks);
router.post('/barks', barksController.postBarks);
router.put('/barks', methodNotAllowed);
router.delete('/barks', methodNotAllowed);

router.get('/barks/:bid', barkController.getBark);
router.post('/barks/:bid', methodNotAllowed);
router.put('/barks/:bid', barkController.putBark);
router.delete('/barks/:bid', barkController.deleteBark);
/*refaktoriraj pa tek onda implementiraj

router.get('/users/:username/barks', barksController.getBarks);
router.post('/users/:username/barks', barksController.postBarks);
router.put('/users/:username/barks', methodNotAllowed);
router.delete('/users/:username/barks', methodNotAllowed);

router.get('/users/:username/barks/:bid', barkController.getBark);
router.post('/users/:username/barks/:bid', methodNotAllowed);
router.put('/users/:username/barks/:bid', barkController.putBark);
router.delete('/users/:username/barks/:bid', barkController.deleteBark);
*/



module.exports = router;