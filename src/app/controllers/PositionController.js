import Position from '../models/Position'
import * as Yup from 'yup'

class PositionController {
  async store (req, res) {
    const schema = Yup.object().shape({
      queueId: Yup.number().required(),
      userId: Yup.number().required(),
      first: Yup.bool(),
      next: Yup.number()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const { id, queueId, userId, first, next } = await Position.create(req.body)

    return res.json({
      id,
      queueId,
      userId,
      first,
      next
    })
  }
}

export default new PositionController()

// (() => {
//   const dbQueue = [
//     { id: 41, name: 'Junior', next: 122 },
//     { id: 122, name: 'Livramento' },
//     { id: 31, name: 'Santana', first: true, next: 12 },
//     { id: 12, name: 'Carlos', next: 41 }
//   ]

//   const orderQueue = (queue) => queue.sort((a, b) => {
//     if (a.first) {
//       return -1
//     }
//     if (b.first) {
//       return 1
//     }
//     if (a.next === b.id) {
//       return -1
//     }
//     if (b.next === a.id) {
//       return 1
//     }
//     return 0
//   })

//   const orderedQueue = orderQueue(dbQueue)

//   return orderedQueue.map((p, i) => ({ position: i + 1, ...p }))
// })()
