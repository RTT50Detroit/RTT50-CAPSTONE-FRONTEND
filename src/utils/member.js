export const getMemberId = (member) => (
  member?._id || member?.id || member?.memberId
);

const getImageValue = (image) => (
  typeof image === 'string' ? image : image?.url || image?.path
);

export const getProfileImage = (member) => (
  getImageValue(
      member?.profileImageUrl ||
      member?.profileImage ||
      member?.photo ||
      member?.imageUrl ||
      member?.image
  )
);

const isTruthyStatus = (value) => (
  value === true ||
  (typeof value === 'string' && ['true', 'online', 'active'].includes(value.toLowerCase()))
);

export const isMemberOnline = (member, currentMemberId) => (
  (currentMemberId && String(getMemberId(member)) === String(currentMemberId)) ||
  isTruthyStatus(member?.isOnline) ||
  isTruthyStatus(member?.online) ||
  isTruthyStatus(member?.onlineStatus) ||
  isTruthyStatus(member?.status)
);
