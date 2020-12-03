import Company from '../models/Company'
import * as Yup from 'yup'

class CompanyController {
  async get (req, res) {
    const id = parseInt(req.params.companyId)

    if (id !== req.companyId) {
      return res.status(400).json({ error: 'Perfil não encontrado' })
    }

    const company = await Company.findByPk(id)

    if (!company) {
      return res.status(404).json({ error: 'Usuario não encontrado' })
    }

    const { name, email } = company

    return res.json({
      id,
      name,
      email
    })
  }

  async store (req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(4)
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' })
    }

    const { email } = req.body

    const companyExists = await Company.findOne({ where: { email } })

    if (companyExists) {
      return res.status(400).json({ error: 'E-mail já cadastrado' })
    }

    const { id, name } = await Company.create(req.body)

    return res.json({
      id,
      name,
      email
    })
  }

  async update (req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(4),
      password: Yup.string().min(4).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field)
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' })
    }

    const { name, email, oldPassword } = req.body

    const id = parseInt(req.params.companyId)

    const company = await Company.findByPk(id)

    if (id !== req.companyId) {
      return res.status(401).json({ error: 'Não é possível editar outro perfil' })
    }

    if (oldPassword && !(await company.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha incorreta' })
    }

    await company.update(req.body)

    return res.json({
      id,
      name,
      email
    })
  }

  async remove (req, res) {
    const id = parseInt(req.params.companyId)

    const company = await Company.findByPk(id)

    if (!company) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    if (id !== req.companyId) {
      return res.status(400).json({ error: 'Não é possível editar outro perfil' })
    }

    const { name, email } = company

    await company.destroy(req.body)

    return res.json({ message: 'Perfil deletado com sucesso', deletedCompany: { id, name, email } })
  }
}

export default new CompanyController()
