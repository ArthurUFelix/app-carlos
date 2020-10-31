export const wrap = (fn) =>
  (req, res, next) =>
    fn(req, res)
      .catch(e => next(e))
