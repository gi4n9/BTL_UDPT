import axios from 'axios';

const API_URL = 'http://localhost:3003/songs';

export interface Song {
  _id: string;
  id: number;
  title: string;
  artistId: number;
  fileUrl: string;
  views: number;
  genres: string[];
  createdAt: string;
  updatedAt: string;
}

export const songService = {
  getAllSongs: async (): Promise<Song[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getSongById: async (id: string): Promise<Song> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getSongsByArtist: async (artistId: number): Promise<Song[]> => {
    const response = await axios.get(`${API_URL}/artist/${artistId}`);
    return response.data;
  }
}; 