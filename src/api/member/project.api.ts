import apiClient from "../client";

export interface MemberProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  owner: string;
  ownerRole: string;
  ownerAvatar: string;
  image: string;
  link: string;
  demo: string;
  techStack?: string[];
  status?: "Planned" | "In Progress" | "Completed";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  status: string;
  results: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: {
    projects: MemberProject[];
  };
}

export interface SingleProjectResponse {
  status: string;
  data: {
    project: MemberProject;
  };
}

export interface CreateProjectResponse {
  status: string;
  message: string;
  data: {
    project: MemberProject;
  };
}

// ==================== ROUTE CONSTANTS ====================
// These are defined inline to avoid depending on routes.ts having the new keys.
// Once you update PROJECT_ROUTES in routes.ts you can switch back to importing them.

const API_BASE = "/api";

const MEMBER_PROJECT_ROUTES = {
  GET_ALL_PROJECTS: `${API_BASE}/projects`,
  GET_MY_PROJECTS: `${API_BASE}/projects/me`,
  GET_PROJECT_BY_ID: (id: string) => `${API_BASE}/projects/project/${id}`,
  SEARCH_PROJECTS: `${API_BASE}/projects/search`,
  CREATE_PROJECT: `${API_BASE}/projects`,
  UPDATE_PROJECT: (id: string) => `${API_BASE}/projects/${id}`,
  DELETE_PROJECT: (id: string) => `${API_BASE}/projects/${id}`,
} as const;

// ==================== API FUNCTIONS ====================

// GET /api/projects
export const getAllProjects = async (): Promise<ProjectsResponse> => {
  const res = await apiClient.get(MEMBER_PROJECT_ROUTES.GET_ALL_PROJECTS);
  return res.data as ProjectsResponse;
};

// GET /api/projects/me
export const getMyProjects = async (): Promise<ProjectsResponse> => {
  const res = await apiClient.get(MEMBER_PROJECT_ROUTES.GET_MY_PROJECTS);
  return res.data as ProjectsResponse;
};

// GET /api/projects/project/:id
export const getProjectById = async (
  id: string,
): Promise<SingleProjectResponse> => {
  const res = await apiClient.get(MEMBER_PROJECT_ROUTES.GET_PROJECT_BY_ID(id));
  return res.data as SingleProjectResponse;
};

// GET /api/projects/search?q=...
export const searchProjects = async (
  query: string,
): Promise<ProjectsResponse> => {
  const res = await apiClient.get(MEMBER_PROJECT_ROUTES.SEARCH_PROJECTS, {
    params: { q: query }, // API expects "q" not "query"
  });
  return res.data as ProjectsResponse;
};

// POST /api/projects  (multipart/form-data)
export const createProject = async (
  payload: FormData,
): Promise<CreateProjectResponse> => {
  const res = await apiClient.post(
    MEMBER_PROJECT_ROUTES.CREATE_PROJECT,
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data as CreateProjectResponse;
};

// PATCH /api/projects/:id  (multipart/form-data)
export const updateProject = async (
  id: string,
  payload: FormData,
): Promise<CreateProjectResponse> => {
  const res = await apiClient.patch(
    MEMBER_PROJECT_ROUTES.UPDATE_PROJECT(id),
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data as CreateProjectResponse;
};

// DELETE /api/projects/:id
export const deleteProject = async (
  id: string,
): Promise<{ status: string; message: string }> => {
  const res = await apiClient.delete(MEMBER_PROJECT_ROUTES.DELETE_PROJECT(id));
  return res.data as { status: string; message: string };
};
