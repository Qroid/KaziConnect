// --- 1. MOCK DATA ---
const initialJobs = [
    {
        id: 1,
        title: "Senior Frontend Developer (React/Vue)",
        company: "Innovatech Solutions",
        logo: "https://via.placeholder.com/40/2563eb/ffffff?text=IS",
        location: "Remote",
        type: "Full-time",
        experience: "Senior Level",
        salary: "Ksh120,000 - Ksh150,000",
        description: "Develop and maintain user-facing features using modern JavaScript frameworks.",
        isFeatured: true
    },
    {
        id: 2,
        title: "Product Designer (UI/UX)",
        company: "Creative Labs",
        logo: "https://via.placeholder.com/40/10b981/ffffff?text=CL",
        location: "New York",
        type: "Contract",
        experience: "Mid Level",
        salary: "Ksh80,000 - Ksh100,000",
        description: "Design intuitive and beautiful interfaces for web and mobile applications.",
        isFeatured: true
    },
    {
        id: 3,
        title: "Junior Backend Engineer",
        company: "DataStream Inc.",
        logo: "https://via.placeholder.com/40/ef4444/ffffff?text=DS",
        location: "London",
        type: "Full-time",
        experience: "Entry Level",
        salary: "Ksh50,000 - Ksh70,000",
        description: "Assist in building scalable RESTful APIs using Node.js.",
        isFeatured: false
    }
];

// --- 2. CORE UTILITIES ---
function getJobs() {
    const stored = localStorage.getItem('kaziConnectJobs');
    return stored ? JSON.parse(stored) : initialJobs;
}

function saveJobs(jobs) {
    localStorage.setItem('kaziConnectJobs', JSON.stringify(jobs));
}

function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- 3. UI RENDERING ---
function createJobCardHTML(job) {
    return `
        <div class="job-card ${job.isFeatured ? 'featured' : ''}" data-job-id="${job.id}">
            <span class="job-type">${job.type}</span>
            <div class="job-card-body">
                <h3 class="job-title">${job.title}</h3>
                <div class="job-company">
                    <img src="${job.logo}" alt="Company Logo">
                    <span>${job.company}</span>
                </div>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-money-bill-wave"></i> ${job.salary || 'Competitive'}</span>
                </div>
                <p style="font-size: 0.9rem; color: var(--gray-color); margin-bottom: 15px;">${job.description}</p>
            </div>
            <a href="#" class="apply-btn">Apply Now</a>
        </div>
    `;
}

function renderJobs() {
    const featuredJobsContainer = document.getElementById('featuredJobs');
    const allJobsContainer = document.getElementById('allJobs');
    const jobs = getJobs();

    // Filters
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('jobTypeFilter').value;
    const expFilter = document.getElementById('experienceFilter').value;
    const locFilter = document.getElementById('locationFilter').value;

    featuredJobsContainer.innerHTML = '';
    allJobsContainer.innerHTML = '';

    const filtered = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery) || job.company.toLowerCase().includes(searchQuery);
        const matchesType = !typeFilter || job.type === typeFilter;
        const matchesExp = !expFilter || job.experience === expFilter;
        const matchesLoc = !locFilter || job.location.includes(locFilter);
        return matchesSearch && matchesType && matchesExp && matchesLoc;
    });

    filtered.forEach(job => {
        const html = createJobCardHTML(job);
        if (job.isFeatured) {
            featuredJobsContainer.insertAdjacentHTML('beforeend', html);
        } else {
            allJobsContainer.insertAdjacentHTML('beforeend', html);
        }
    });
}

// --- 4. APP INITIALIZATION ---
function init() {
    // Theme Toggle
    const themeBtn = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Modal Handling
    const postJobModal = document.getElementById('postJobModal');
    document.getElementById('postJobBtn').addEventListener('click', () => postJobModal.classList.add('active'));
    document.getElementById('closePostJobModal').addEventListener('click', () => postJobModal.classList.remove('active'));

    // Post Job Form
    document.getElementById('jobPostForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const jobs = getJobs();
        const newJob = {
            id: Date.now(),
            title: document.getElementById('jobTitle').value,
            company: document.getElementById('companyName').value,
            logo: document.getElementById('companyLogo').value || "https://via.placeholder.com/40/64748b/ffffff?text=Co",
            location: document.getElementById('jobLocation').value,
            type: document.getElementById('jobType').value,
            experience: document.getElementById('experienceLevel').value,
            salary: document.getElementById('jobSalary').value,
            description: document.getElementById('jobDesc').value,
            isFeatured: false
        };

        jobs.unshift(newJob);
        saveJobs(jobs);
        renderJobs();
        postJobModal.classList.remove('active');
        e.target.reset();
        showToast('Job listing published successfully!');
    });

    // Real-time filtering
    document.getElementById('searchForm').addEventListener('submit', (e) => e.preventDefault());
    ['searchInput', 'jobTypeFilter', 'experienceFilter', 'locationFilter', 'salaryFilter'].forEach(id => {
        document.getElementById(id).addEventListener('input', renderJobs);
    });

    // Offline Handling
    window.addEventListener('online', () => document.body.classList.remove('offline'));
    window.addEventListener('offline', () => {
        document.body.classList.add('offline');
        showToast('You are offline. Features may be limited.', 'error');
    });

    renderJobs();
}

document.addEventListener('DOMContentLoaded', init);
