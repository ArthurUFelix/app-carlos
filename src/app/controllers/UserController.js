import User from '../models/User'
import Queue from '../models/Queue'

import * as Yup from 'yup'

class UserController {
  async list (req, res) {
    const users = await User.findAll()

    return res.json({ users })
  }

  async store (req, res) {
    const schema = Yup.object().shape({
      queueId: Yup.string().required(),
      ingressCode: Yup.string().required(),
      name: Yup.string().required(),
      phone: Yup.string().required().min(8)
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const { ingressCode, phone } = req.body

    const userExists = await User.findOne({ where: { phone } })

    if (userExists) {
      return res.status(400).json({ error: 'Phone number already registered' })
    }

    const queue = await Queue.findOne({ where: { ingressCode } })

    if (!queue) {
      return res.status(401).json({ error: 'Ingress code not match' })
    }

    const { id, queueId, name } = await User.create(req.body)

    return res.json({
      id,
      queueId,
      ingressCode,
      name,
      phone
    })
  }

  async remove (req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const user = await User.findByPk(req.body.id)

    await user.destroy(req.body)

    return res.json({ message: 'User deleted' })
  }
}

export default new UserController()
