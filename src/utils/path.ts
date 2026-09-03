const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path = '/') {
	if (path === '/') return `${base}/`;
	return `${base}/${path.replace(/^\//, '')}`;
}

export function tagSlug(tag: string) {
	return encodeURIComponent(tag.trim().toLowerCase().replace(/\s+/g, '-'));
}
