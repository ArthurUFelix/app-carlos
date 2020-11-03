import { Op } from 'sequelize'

import Queue from '../models/Queue'
import Position from '../models/Position'

import * as Yup from 'yup'

class QueueController {
  async listAll (req, res) {
    const queues = await Queue.findAll({ where: { companyId: req.companyId } })

    if (!queues.length) {
      return res.status(400).json({ error: 'Company has no Queues or does not exist' })
    }

    return res.json(queues)
  }

  async list (req, res) {
    const id = parseInt(req.params.queueId)

    const { companyId, ingressCode, observation, startTime, endTime } = await Queue.findByPk(id)

    if (companyId !== req.companyId) {
      return res.status(401).json({ error: 'Cannot get another Company\'s Queue' })
    }

    return res.json({
      id,
      companyId,
      ingressCode,
      observation,
      startTime,
      endTime
    })
  }

  async listQueueUsers (req, res) {
    const queueId = parseInt(req.params.queueId)

    const position = await Position.findAll({ where: { queueId } })

    const orderQueue = (queue) => queue.sort((a, b) => {
      if (a.first) {
        return -1
      }
      if (b.first) {
        return 1
      }
      if (a.next === b.id) {
        return -1
      }
      if (b.next === a.id) {
        return 1
      }
      return 0
    })

    const orderedQueue = orderQueue(position)

    const queueWithPosition = orderedQueue.map((element, index) => ({ position: index + 1, ...element.dataValues }))

    if (!queueWithPosition.length) {
      return res.status(400).json({ error: 'Queue is empty or does not exist ' })
    }

    return res.json(queueWithPosition)
  }

  async addUserToQueue (req, res) {
    const schema = Yup.object().shape({
      ingressCode: Yup.string().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const userId = parseInt(req.params.userId)

    const userExists = await Position.findOne({ where: { userId } })

    if (userExists) {
      return res.status(400).json({ error: 'User already registered in Queue' })
    }

    const { ingressCode } = req.body

    const { id: queueId } = await Queue.findOne({ where: { ingressCode } })

    const lastCreatedPosition = await Position.findOne(
      {
        where: { queueId },
        order: [['createdAt', 'DESC']]
      }
    )

    const position = await Position.create({ queueId, userId })

    if (lastCreatedPosition) {
      await lastCreatedPosition.update({ next: position.id })
    } else {
      position.first = true
      await position.save()
    }

    return res.json({
      position
    })
  }

  async handleUserFromQueue (req, res) {
    const queueId = parseInt(req.params.queueId)

    const queue = await Queue.findOne({ where: { id: queueId } })

    if (!queue || queue.companyId !== req.companyId) {
      return res.status(401).json({ error: 'Cannot handle User' })
    }

    const firstPosition = await Position.findOne({
      where: {
        [Op.and]: [
          { queueId },
          { first: true }
        ]
      }
    })

    const nextPosition = await Position.findOne({ where: { id: firstPosition.next } })

    nextPosition.first = true

    await nextPosition.save()

    await firstPosition.destroy()

    return res.json({ message: 'User handled', handledPosition: firstPosition })
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
      return res.status(401).json({ error: 'Cannot create Queue with another Company' })
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

    const id = parseInt(req.params.queueId)

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
    const id = parseInt(req.params.queueId)

    const result = await Queue.destroy({
      where: {
        [Op.and]: [
          { id },
          { companyId: req.companyId }
        ]
      }
    })

    if (result) {
      return res.json({ message: 'Queue deleted', deletedQueueId: id })
    } else {
      return res.status(401).json({ error: 'Cannot delete Queue' })
    }
  }
}

export default new QueueController()
