import Queue from '../models/Queue'

import * as Yup from 'yup'

class QueueController {
  async list (req, res) {
    const queues = await Queue.findAll()

    return res.json({ queues })
  }

  async store (req, res) {
    const schema = Yup.object().shape({
      ingressCode: Yup.string().required(),
      observation: Yup.string(),
      companyId: Yup.string(),
      startTime: Yup.date().required(),
      endTime: Yup.date().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const { companyId } = req.body

    if (companyId !== req.companyId) {
      return res.status(401).json({ error: 'Cannot modify another company\'s queue' })
    }

    const { id, ingressCode, observation, startTime, endTime } = await Queue.create(req.body)

    return res.json({
      id,
      companyId,
      ingressCode,
      observation,
      startTime,
      endTime
    })
  }

  async update (req, res) {
    const schema = Yup.object().shape({
      companyId: Yup.number().required(),
      ingressCode: Yup.string(),
      observation: Yup.string(),
      startTime: Yup.date(),
      endTime: Yup.date()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const { companyId } = req.body

    const queue = await Queue.findOne({ where: { companyId: req.companyId } })

    const { id, ingressCode, observation, startTime, endTime } = await queue.update(req.body)

    return res.json({
      id,
      companyId,
      ingressCode,
      observation,
      startTime,
      endTime
    })
  }

  async remove (req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const queue = await Queue.findByPk(req.body.id)

    await queue.destroy(req.body)

    return res.json({ message: 'Queue deleted' })
  }
}

export default new QueueController()
