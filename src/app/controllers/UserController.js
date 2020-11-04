import User from '../models/User'

import * as Yup from 'yup'

class UserController {
  async list (req, res) {
    const id = parseInt(req.params.userId)

    const { name, phone } = await User.findByPk(id)

    return res.json({
      id,
      name,
      phone
    })
  }

  async store (req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      phone: Yup.string().required().min(8)
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const { id, name, phone } = await User.create(req.body)

    return res.json({
      id,
      name,
      phone
    })
  }
}

export default new UserController()
