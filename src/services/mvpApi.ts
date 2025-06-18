
import { MvpFormDto, MvpApiResponse, ApiFilters } from '../types/mvp';


const API_BASE = 'https://zovoaapi.lytortech.com/api';


export const mvpApi = {
  
  // Fetch all MVPs with filters
  async fetchMvps(filters: ApiFilters = {}): Promise<MvpApiResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE}/mvp/get/all/forms?${queryParams}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch MVPs');

    const data = await response.json();

    console.log(data);

    return {
      data: data.data || data,
      total: data.total || (data.data ? data.data.length : data.length),
      // Include these only if they're part of your type
      page: data.page,
      size: data.size
    };
  },

  // Update progress
  async updateProgress(id: number, progress: number): Promise<void> {
    const payload = { progress };
    const url = `${API_BASE}/mvp/${id}/progress/${progress}`;

    console.log('Sending PATCH request to:', url);
    console.log('Request payload:', payload);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },

    });

  

    const responseData = await response.json().catch(() => null); // In case response isn't JSON

    if (!response.ok) {
      console.error('Failed to update progress. Status:', response.status);
      console.error('Response:', responseData);
      throw new Error('Failed to update progress');
    }


    console.log('Progress updated successfully');
    console.log('Response data:', responseData);
  },




  // Assign user
  async assignUser(id: string, assignedTo: string | null): Promise<void> {
    const response = await fetch(`${API_BASE}/mvp/${id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedTo })
    });
    if (!response.ok) throw new Error('Failed to assign user');
  },

  // Add milestone
  async addMilestone(
    id: number,
    milestone: {
      title: string;
      notes: string;
      dueDate: string;
      completed: boolean
    }
  ): Promise<void> {
    console.log('Sending milestone data:', milestone);
    const response = await fetch(`${API_BASE}/mvp/${id}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(milestone)
    });
    if (!response.ok) throw new Error('Failed to add milestone');
    
    try {
      const responseData = await response.json();
      console.log('Response received:', responseData);
    } catch {
      console.log('Response received but no JSON data.');
      
    }
  },

  // Add activity
  async addActivity(id: string, message: string): Promise<void> {
    const response = await fetch(`${API_BASE}/mvp/${id}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Failed to add activity');
  },

  // Update MVP details
  async updateMvp(id: string, updates: Partial<MvpFormDto>): Promise<void> {
    const response = await fetch(`${API_BASE}/mvp/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update MVP');
  }


};
