import Queue from '../models/Queue'
import { Op } from 'sequelize'

import * as Yup from 'yup'

class QueueController {
  async list (req, res) {
    const queues = await Queue.findAll({
      attributes: [
        'id',
        'companyId',
        'ingressCode',
        'observation',
        'startTime',
        'endTime'
      ]
    })

    return res.json(queues)
  }

  async store (req, res) {
    const schema = Yup.object().shape({
      companyId: Yup.number().required(),
      ingressCode: Yup.string().required(),
      observation: Yup.string(),
      startTime: Yup.date().required(),
      endTime: Yup.date().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const { companyId } = req.body

    if (companyId !== req.companyId) {
      return res.status(401).json({ error: 'Cannot modify another Company' })
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

    const id = parseInt(req.params.id)

    const queue = await Queue.findByPk(id)

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' })
    }

    const { companyId } = req.body

    if (companyId !== req.companyId) {
      return res.status(400).json({ error: 'Cannot modify another Company\'s queue' })
    }

    const { ingressCode, observation, startTime, endTime } = await queue.update(req.body)

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
    const id = parseInt(req.params.id)

    const result = await Queue.destroy({
      where: {
        [Op.and]: [
          { id },
          { companyId: req.companyId }
        ]
      }
    })

    if (result) {
      return res.json({ message: 'Queue deleted' })
    } else {
      return res.status(401).json({ error: 'Cannot delete queue' })
    }
  }
}

export default new QueueController()
