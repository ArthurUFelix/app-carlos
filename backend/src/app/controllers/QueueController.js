import { Op } from 'sequelize'

import Queue from '../models/Queue'
import Position from '../models/Position'
import User from '../models/User'

import * as Yup from 'yup'

class QueueController {
  async listAll (req, res) {
    const queues = await Queue.findAll({ where: { companyId: req.companyId } })

    if (!queues.length) {
      return res.status(404).json({ error: 'Nenhuma fila ativa no momento.' })
    }

    return res.json(queues)
  }

  async get (req, res) {
    const id = parseInt(req.params.queueId)

    const queue = await Queue.findByPk(id)

    if (!queue) {
      return res.status(404).json({ error: 'Fila não encontrada' })
    }

    const { companyId, ingressCode, observation, startTime, endTime } = queue

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
      return res.status(404).json({ error: 'A fila está vazia ou não foi cadastrada!' })
    }

    return res.json(queueWithPosition)
  }

  async addUserToQueue (req, res) {
    const schema = Yup.object().shape({
      ingressCode: Yup.string().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' })
    }

    const userId = parseInt(req.params.userId)

    const userExist = await User.findByPk(userId)

    if (!userExist) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const { ingressCode } = req.body

    const queue = await Queue.findOne({ where: { ingressCode } })

    if (!queue) {
      return res.status(404).json({ error: 'Código inválido' })
    }

    const { id: queueId } = queue

    const userInQueue = await Position.findOne({
      where: {
        [Op.and]: [
          { queueId },
          { userId }
        ]
      }
    })

    if (userInQueue) {
      return res.status(400).json({ error: 'Usuário já registrado na fila' })
    }

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
      return res.status(401).json({ error: 'Não foi possível chamar o cliente' })
    }

    const firstPosition = await Position.findOne({
      where: {
        [Op.and]: [
          { queueId },
          { first: true }
        ]
      }
    })

    if (!firstPosition) {
      return res.status(400).json({ error: 'A fila está vazia!' })
    }

    const nextPosition = await Position.findOne({ where: { id: firstPosition.next } })

    if (nextPosition) {
      nextPosition.first = true
      await nextPosition.save()
    }

    await firstPosition.destroy()

    return res.json({ message: 'Usuário chamado!', handledPosition: firstPosition })
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
      return res.status(400).json({ error: 'Erro de validação' })
    }

    const { ingressCode, companyId } = req.body

    if (companyId !== req.companyId) {
      return res.status(401).json({ error: 'Não foi possível criar a fila' })
    }

    const ingressCodeExists = await Queue.findOne({ where: { ingressCode } })

    if (ingressCodeExists) {
      return res.status(400).json({ error: 'Este código já está em uso' })
    }

    const { id, observation, startTime, endTime } = await Queue.create(req.body)

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
      return res.status(400).json({ error: 'Erro de validação' })
    }

    const id = parseInt(req.params.queueId)

    const queue = await Queue.findOne({
      where: {
        [Op.and]: [
          { id },
          { companyId: req.companyId }
        ]
      }
    })

    if (!queue) {
      return res.status(404).json({ error: 'Fila não encontrada' })
    }

    const { companyId } = req.body

    if (companyId !== req.companyId) {
      return res.status(400).json({ error: 'Não é possível editar a fila' })
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
      return res.json({ message: 'Fila deletada', deletedQueueId: id })
    } else {
      return res.status(404).json({ error: 'Fila não encontrada' })
    }
  }
}

export default new QueueController()
