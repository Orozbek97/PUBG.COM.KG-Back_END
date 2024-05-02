const router = require('express').Router()
const { body } = require('express-validator')
const multer = require('multer')
const { fileFilter, storage } = require('../middlewares/chekImage')

const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controllers')
const userUpdateController = require('../controllers/userUpdate-controller')
const tournamentController = require('../controllers/tournament-controller')
const squadTeamController = require('../controllers/squadTeam-controller')
const duoTeamController = require('../controllers/duoTeam-controller')

const uploadChekImage = multer({ storage, fileFilter })

// auth-router
router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 3, max: 20 }),
	userController.registration
)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.post('/send/reset/password/mail', userController.sendPasswordResetMail)
router.put('/reset/password/:userId', userController.changePassword)

// player-router
router.get('/users', userController.getUsers)
router.get('/player/:playerId', userController.getPlayerById)

// tournament-router
router.get('/getTournaments', tournamentController.getTournaments)
router.get('/tournament/:tournamentId', tournamentController.getTournamentById)
router.post('/tournament/:tournamentId/participate',tournamentController.participateInTournament)

// squadteam-router
router.post('/create/squadteam', squadTeamController.addSquadTeam)
router.get('/squadteam', squadTeamController.getSquadTeams)
router.get('/squadteam/:squadteamId', squadTeamController.getSquadTeamsById)

// duoteam-router
router.post('/create/duoteam', duoTeamController.addDuoTeam)
router.get('/duoteam', duoTeamController.getDuoTeams);
router.get('/duoteam/:duoteamId', duoTeamController.getDuoTeamsById);

// admin panel
router.post('/admin-panel/pubg/www/registration', adminController.registration);
router.post('/admin-panel/pubg/www/login', adminController.login);
router.post('/admin-panel/pubg/www/logout', adminController.logout);
router.post('/addtournament', tournamentController.addTournament);
router.get('/admin-panel/pubg/www/refresh', adminController.refresh)
router.put('/admin-panel/pubg/www/tournament/complete/:tournamentId', adminController.completeTournament)
router.put('/admin-panel/pubg/www/tournament/result/:tournamentId', adminController.addResults)
router.delete('/admin-panel/pubg/www/tournament/participant/remove/:tournamentId/userId/:userId', adminController.removeParticipant)
router.delete('/admin-panel/pubg/www/player/delete/:userId', adminController.deletePlayer)
router.put('/admin-panel/pubg/www/player/update/:userId', adminController.addTopPlace)


// редактирование профиля
router.post('/update-profile/:userId', userUpdateController.updateProfile)
router.post('/update-profile/avatar/:userId', userUpdateController.updateAvatar)

// оплата участия в турнире
router.post(
	'/upload-checkImage',
	uploadChekImage.single('paymentImage'),
	(req, res, next) => {
		try {
			const file = req.file.path
			if (!file) {
				const error = new Error('Пожалуйста, выберите фото для загрузки')
				error.httpStatusCode = 400
				return next(error)
			}
			res.json(req.file)
		} catch (error) {
			console.error(error)
			next(error)
		}
	}
)

module.exports = router
