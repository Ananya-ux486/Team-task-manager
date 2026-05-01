import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/project.service';
import { ok } from '../types/api';

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.getProjects(req.user!.userId);
    res.json(ok(projects));
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Any authenticated user can create a project.
    // They automatically become the ADMIN of that project.
    const { name, description } = req.body;
    const project = await projectService.createProject(name, description, req.user!.userId);
    res.status(201).json(ok(project));
  } catch (err) {
    next(err);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user!.userId);
    res.json(ok(project));
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.json(ok(project));
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.json(ok({ message: 'Project deleted successfully' }));
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.body;
    const member = await projectService.addMember(req.params.id, userId, role);
    res.status(201).json(ok(member));
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await projectService.removeMember(req.params.id, req.params.userId);
    res.json(ok({ message: 'Member removed successfully' }));
  } catch (err) {
    next(err);
  }
};

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await projectService.getMembers(req.params.id);
    res.json(ok(members));
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string | undefined;
    const users = await projectService.getAllUsers(search);
    res.json(ok(users));
  } catch (err) {
    next(err);
  }
};
