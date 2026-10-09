export function displayName(user, fallback = 'Guest') {
  const metadata = user?.user_metadata || {};
  for (const value of [metadata.full_name, metadata.name, metadata.given_name]) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return user?.email?.split('@')[0] || fallback;
}
