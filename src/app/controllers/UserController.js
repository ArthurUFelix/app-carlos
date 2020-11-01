import User from '../models/User'

import * as Yup from 'yup'

class UserController {
  async list (req, res) {
    const users = await User.findAll({
      attributes: [
        'id',
        'name',
        'phone'
      ]
    })

    return res.json(users)
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

  async update (req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      phone: Yup.string()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const { name, phone } = req.body

    const id = parseInt(req.params.id)

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    await user.update(req.body)

    return res.json({
      id,
      name,
      phone
    })
  }

  async remove (req, res) {
    const id = parseInt(req.params.id)

    const result = await User.destroy({ where: { id } })

    if (result) {
      return res.json({ message: 'User deleted' })
    } else {
      return res.status(404).json({ error: 'User not found' })
    }
  }
}

export default new UserController()
