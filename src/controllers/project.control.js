import { assert } from 'superstruct'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { getProjectListService } from '../services/productService.js'

export const getListProjects = asyncHandler(async(req, res) => {
  const { offset=0, limit=10, order='newest', keyword } = req.query;

  const list = await getProjectListService({ offset, limit, order, keyword })
  res.status(200).json(list);
})