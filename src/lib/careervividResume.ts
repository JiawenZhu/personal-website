export interface CareerVividResume {
  schemaVersion: "1.0";
  id: string;
  userId: string;
  title: string;
  updatedAt: string | null;
  profile: {
    name: string;
    headline: string | null;
    location: string | null;
    summary: string | null;
    websites: Array<{
      label: string;
      url: string;
    }>;
  };
  experience: Array<{
    company: string;
    title: string;
    location: string | null;
    startDate: string | null;
    endDate: string | null;
    bullets: string[];
  }>;
  skills: Array<{
    name: string;
    level: string | null;
  }>;
  education: Array<{
    school: string;
    degree: string;
    location: string | null;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
  }>;
}

const DEFAULT_API_BASE_URL = "https://careervivid.app";
const DEFAULT_RESUME_ID = "9JHMyYQbNZPvFAANsb5e";

export const CAREERVIVID_API_BASE_URL =
  import.meta.env.VITE_CAREERVIVID_API_BASE_URL || DEFAULT_API_BASE_URL;

export const CAREERVIVID_USER_ID = import.meta.env.VITE_CAREERVIVID_USER_ID || "";

export const CAREERVIVID_RESUME_ID =
  import.meta.env.VITE_CAREERVIVID_RESUME_ID || DEFAULT_RESUME_ID;

export async function fetchCareerVividResume(options?: {
  userId?: string;
  resumeId?: string;
  signal?: AbortSignal;
}): Promise<CareerVividResume> {
  const userId = options?.userId || CAREERVIVID_USER_ID;
  const resumeId = options?.resumeId || CAREERVIVID_RESUME_ID;

  if (!resumeId && !userId) {
    throw new Error("Missing VITE_CAREERVIVID_RESUME_ID or VITE_CAREERVIVID_USER_ID.");
  }

  const path = userId
    ? `/api/public/resume/${encodeURIComponent(userId)}${resumeId ? `/${encodeURIComponent(resumeId)}` : ""}`
    : `/api/public/resume/${encodeURIComponent(resumeId)}`;

  const url = new URL(path, CAREERVIVID_API_BASE_URL);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal: options?.signal,
  });

  if (!response.ok) {
    let message = `CareerVivid resume request failed with status ${response.status}.`;

    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // Keep the status-based error when the response body is not JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<CareerVividResume>;
}

export async function downloadCareerVividResumePdf(userId: string, resumeId: string): Promise<void> {
  const response = await fetch("https://us-west1-jastalk-firebase.cloudfunctions.net/generateResumePdfHttp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      resumeId,
    }),
  });

  if (!response.ok) {
    let message = `Failed to generate resume PDF. Status: ${response.status}`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  
  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = `resume_${resumeId}.pdf`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

