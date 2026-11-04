/**
 * Project Type Definitions
 * TypeScript interfaces for project-related data structures
 */

export type ProjectStatus = "Planned" | "In Progress" | "Completed";

export interface Project {
  id: string;
  userId?: string;
  title: string;
  description: string;
  owner: string;
  ownerRole: string;
  ownerAvatar: string;
  image: string;
  link: string;
  demo: string;
  techStack?: string[];
  status?: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  image: string;
  link: string;
  demo: string;
  /** Comma-separated list, e.g. "React, Node.js". */
  techStack?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  demo?: string;
  techStack?: string;
  status?: ProjectStatus;
}

export interface ProjectsResponse {
  status: string;
  results?: number;
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  data: {
    projects: Project[];
  };
}

export interface ProjectResponse {
  status: string;
  message?: string;
  data: {
    project: Project;
  };
}
