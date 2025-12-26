//import { assert } from "superstruct";
import projectService from '../services/project.service.js';

async function getList(req, res, next) {
  const projectListWithCounts = await projectService.getList();
  res.status(200).json(projectListWithCounts);
}

export default {
  getList
};
