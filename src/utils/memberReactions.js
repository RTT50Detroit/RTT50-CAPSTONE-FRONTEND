import axios from 'axios';

const reactionsUrl = () => (
  `${(import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '')}/api/members/reactions`
);

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
});

export const fetchMemberReactions = async () => {
  const { data } = await axios.get(reactionsUrl(), authConfig());
  return data;
};

export const saveMemberReaction = async (targetId, reaction) => {
  const { data } = await axios.put(
      `${reactionsUrl()}/${encodeURIComponent(targetId)}`,
      { reaction },
      authConfig(),
  );
  return data;
};

export const clearMemberReaction = async (targetId) => {
  const { data } = await axios.delete(
      `${reactionsUrl()}/${encodeURIComponent(targetId)}`,
      authConfig(),
  );
  return data;
};
