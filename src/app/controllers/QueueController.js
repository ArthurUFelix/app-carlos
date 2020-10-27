import Queue from '../models/Queue'
import * as Yup from 'yup'

class QueueController {
    async store(req, res) {
        const schema = Yup.object().shape({
            observation: Yup.string(),
            start_time: Yup.date().required(),
            end_time: Yup.date().required()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' })
        }

        const { id, company_id, observation, start_time, end_time } = await Queue.create(req.body)

        return res.json({
            id,
            company_id,
            observation,
            start_time,
            end_time
        })
    }
}

export default new QueueController()
