
import { ThreeDWebsiteTemplet, ThreeDWebsiteForm, CreateThreeDTemplateRequest, PaginationResponse } from '@/types/mvp';

const API_BASE_URL = 'https://zovoaapi.lytortech.com';

export const mvp3DApi = {
  // 3D Website Templates
  async saveThreeDTemplate(template: CreateThreeDTemplateRequest): Promise<ThreeDWebsiteTemplet> {
    const response = await fetch(`${API_BASE_URL}/api/3d-website-templets/save/templet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      throw new Error(`Failed to save template: ${response.statusText}`);
    }

    return response.json();
  },

  async getThreeDTemplates(niche: string): Promise<ThreeDWebsiteTemplet[]> {
    const response = await fetch(`${API_BASE_URL}/api/3d-website-templets/get/templet/${encodeURIComponent(niche)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.statusText}`);
    }

    return response.json();
  }
  ,

  // 3D Website Forms
  async getThreeDForms(page: number = 0, size: number = 5): Promise<PaginationResponse<ThreeDWebsiteForm>> {
    console.log("calling");
    const response = await fetch(`${API_BASE_URL}/api/3d-website-forms?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch forms: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API data", data); 
    return data;

  }

};
