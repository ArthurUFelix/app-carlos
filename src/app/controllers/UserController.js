import User from '../models/User'
import * as Yup from 'yup'

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            phone: Yup.string().required().min(8)
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' })
        }

        const userExists = await User.findOne({ where: { phone: req.body.phone } })

        if(userExists) {
            return res.status(400).json({ error: 'Phone number already registered' })
        }

        const { id, queue_id, name, phone } = await User.create(req.body)

        return res.json({
            id,
            queue_id,
            name,
            phone
        })
    }
}

export default new UserController()
