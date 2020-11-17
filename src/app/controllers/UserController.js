import User from '../models/User'

import * as Yup from 'yup'

class UserController {
  async get (req, res) {
    const id = parseInt(req.params.userId)

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ error: 'Cannot get User' })
    }

    const { name, phone } = user

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
