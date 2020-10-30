import Queue from '../models/Queue'

import * as Yup from 'yup'

class QueueController {
    async list(req, res) {
        const queues = await Queue.findAll()

        return res.json({ queues })
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            ingress_code: Yup.string().required(),
            observation: Yup.string(),
            start_time: Yup.date().required(),
            end_time: Yup.date().required()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' })
        }

        const { company_id } = req.body

        if (company_id != req.companyId) {
            return res.status(401).json({ error: 'Not your company' })
        }

        /* SÓ DEIXA CRIAR UMA FILA */
        // const queueExists = await Queue.findOne({ where: { company_id: req.companyId } })

        // if (queueExists) {
        //     return res.status(400).json({ error: 'Queue has already been created' })
        // }

        const { id, ingress_code, observation, start_time, end_time } = await Queue.create(req.body)
        
        return res.json({
            id,
            company_id,
            ingress_code,
            observation,
            start_time,
            end_time
        })
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
            ingress_code: Yup.string(),
            observation: Yup.string(),
            start_time: Yup.date(),
            end_time: Yup.date()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' })
        }

        const queue = await Queue.findByPk(req.body.id)

        const { id, company_id, ingress_code, observation, start_time, end_time } = await queue.update(req.body)

        return res.json({
            id,
            company_id,
            ingress_code,
            observation,
            start_time,
            end_time
        })
    }

    async remove(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' })
        }
        
        const queue = await Queue.findByPk(req.body.id)

        await queue.destroy(req.body)

        return res.json({ message: "Queue deleted" })
    }
}

export default new QueueController()
