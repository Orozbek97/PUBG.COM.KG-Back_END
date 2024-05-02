const e = require("cors");
const squadTeamSevice = require("../service/squadTeam-sevice");


class SquadTeamController {
    async addSquadTeam (req , res, next) {
        try {
            const {
                name
            }  = req.body
            const squadteamData = await squadTeamSevice.addSquadTeam (
                name
            )
            return res.json(squadteamData)
            
        } catch (e) {
            next(e);
        }
    }

    async getSquadTeams (req, res , next) {
        try {
            const squadteams = await squadTeamSevice.getSquadTeams()
            return res.json(squadteams)

        } catch (e) {
            next(e);
        }
    }

    async getSquadTeamsById (req, res, next) {
        try {
            const {squadteamId} = req.params;
            const squadteam = await squadTeamSevice.getSquadTeamsById(squadteamId)

            return res.json(squadteam)

        } catch (e) {
            next (e)
        }
    }
}



module.exports = new SquadTeamController();