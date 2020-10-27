import Company from '../models/Company'
import * as Yup from 'yup'

class CompanyController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(4)
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' })
        }

        const companyExists = await Company.findOne({ where: { email: req.body.email } })

        if(companyExists) {
            return res.status(400).json({ error: 'Company already exists' })
        }

        const { id, name, email } = await Company.create(req.body)

        return res.json({
            id,
            name,
            email
        })
    }

    async update(req, res) {
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

        const { email, oldPassword } = req.body

        const company = await Company.findByPk(req.companyId)

        if (email != company.email) {
            const companyExists = await Company.findOne({ where: { email } })
            
            if(companyExists) {
                return res.status(400).json({ error: 'Company already exists' })
            }
        }

        if (oldPassword && !(await company.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match' })
        }

        const { id, name } = await company.update(req.body)

        return res.json({
            id,
            name,
            email
        })
    }
}

export default new CompanyController()
