import Company from '../models/Company'
import * as Yup from 'yup'

class CompanyController {
  async get (req, res) {
    const id = parseInt(req.params.companyId)

    const company = await Company.findByPk(id)

    if (!company) {
      return res.status(404).json({ error: 'Cannot get Company' })
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
      return res.status(400).json({ error: 'Validation failed' })
    }

    const { email } = req.body

    const companyExists = await Company.findOne({ where: { email } })

    if (companyExists) {
      return res.status(400).json({ error: 'Company already exists' })
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
      return res.status(400).json({ error: 'Validation failed' })
    }

    const { name, email, oldPassword } = req.body

    const id = parseInt(req.params.companyId)

    const company = await Company.findByPk(id)

    if (id !== req.companyId) {
      return res.status(401).json({ error: 'Cannot modify other Company' })
    }

    if (oldPassword && !(await company.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' })
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
      return res.status(404).json({ error: 'Company not found' })
    }

    if (id !== req.companyId) {
      return res.status(400).json({ error: 'Cannot modify other Company' })
    }

    const { name, email } = company

    await company.destroy(req.body)

    return res.json({ message: 'Company deleted', deletedCompany: { id, name, email } })
  }
}

export default new CompanyController()
