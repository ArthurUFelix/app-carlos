import User from '../models/User'

import * as Yup from 'yup'

class UserController {
  async get (req, res) {
    const id = parseInt(req.params.userId)

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
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
      return res.status(400).json({ error: 'Erro de validação' })
    }

    const { id, name, phone } = await User.create(req.body)

    return res.json({
      id,
      name,
      phone
    })
  }

  async remove (req, res) {
    const id = parseInt(req.params.userId)

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    await user.destroy(req.body)

    return res.json({ message: 'User deleted' })
  }
}

export default new UserController()
