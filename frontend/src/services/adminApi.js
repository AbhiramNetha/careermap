
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export async function adminLogin(email, password) {
    const res = await fetch(`${BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
}


export async function fetchPublicCourses(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE}/courses?${qs}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch courses');
    return data;
}

export async function createCourse(courseData, token) {
    const res = await fetch(`${BASE}/admin/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(courseData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create course');
    return data;
}

export async function updateCourse(id, courseData, token) {
    const res = await fetch(`${BASE}/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(courseData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update course');
    return data;
}

export async function deleteCourse(id, token) {
    const res = await fetch(`${BASE}/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete course');
    return data;
}

export async function trackCourseClick(id, userEmail = 'anonymous') {
    const res = await fetch(`${BASE}/courses/${id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to track click');
    return data;
}


export async function fetchAnalyticsSummary(token) {
    const res = await fetch(`${BASE}/analytics/summary`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch analytics');
    return data;
}

export async function trackVisit() {
    try {
        await fetch(`${BASE}/analytics/track`, { method: 'POST' });
    } catch {
        void 0;
    }
}

export async function fetchOpportunities(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE}/opportunities?${qs}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch opportunities');
    return data;
}

export async function createOpportunity(opportunityData, token) {
    const res = await fetch(`${BASE}/admin/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(opportunityData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create opportunity');
    return data;
}

export async function updateOpportunity(id, opportunityData, token) {
    const res = await fetch(`${BASE}/admin/opportunities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(opportunityData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update opportunity');
    return data;
}

export async function deleteOpportunity(id, token) {
    const res = await fetch(`${BASE}/admin/opportunities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete opportunity');
    return data;
}

export async function trackOpportunityClick(id, userEmail = 'anonymous') {
    const res = await fetch(`${BASE}/opportunities/${id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to track opportunity click');
    return data;
}
