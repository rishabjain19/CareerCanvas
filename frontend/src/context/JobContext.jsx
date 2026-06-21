import { createContext, useState, useContext, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const JobContext = createContext(null);

export function JobProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addJob = async (jobData) => {
    try {
      const res = await api.post('/jobs', jobData);
      setJobs((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
      throw err;
    }
  };

  const updateJob = async (id, updates) => {
    try {
      const res = await api.put(`/jobs/${id}`, updates);
      setJobs((prev) => prev.map((job) => (job._id === id ? res.data : job)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job');
      throw err;
    }
  };

  const deleteJob = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job');
      throw err;
    }
  };

  // Optimistic move: update UI instantly when a card is dragged, before the server confirms.
  // If the API call fails, roll back to the previous state.
  const moveJob = async (id, newStatus) => {
    const previousJobs = jobs;
    setJobs((prev) =>
      prev.map((job) => (job._id === id ? { ...job, status: newStatus } : job))
    );
    try {
      await api.put(`/jobs/${id}`, { status: newStatus });
    } catch (err) {
      setJobs(previousJobs); // rollback on failure
      setError('Failed to move job — reverted');
      throw err;
    }
  };

  return (
    <JobContext.Provider
      value={{ jobs, loading, error, fetchJobs, addJob, updateJob, deleteJob, moveJob }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
