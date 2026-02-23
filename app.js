// --- 1. MOCK DATA ---
const initialJobs = [
    {
        id: 1,
        title: "Senior Frontend Developer (React/Vue)",
        company: "Innovatech Solutions",
        logo: "https://via.placeholder.com/30/2563eb/ffffff?text=IS",
        location: "Remote",
        type: "Full-time",
        experience: "Senior Level",
        salary: "Ksh120,000 - Ksh150,000",
        description: "Develop and maintain user-facing features using modern JavaScript frameworks. Requires 5+ years of experience and deep knowledge of component-based architecture.",
        postedDate: "2 days ago",
        isFeatured: true
    },
    {
        id: 2,
        title: "Product Designer (UI/UX)",
        company: "Creative Labs",
        logo: "https://via.placeholder.com/30/10b981/ffffff?text=CL",
        location: "New York",
        type: "Contract",
        experience: "Mid Level",
        salary: "Ksh80,000 - Ksh100,000",
        description: "Design intuitive and beautiful interfaces for web and mobile applications. Proficiency in Figma/Sketch is a must.",
        postedDate: "1 week ago",
        isFeatured: true
    },
    {
        id: 3,
        title: "Junior Backend Engineer (Node.js)",
        company: "DataStream Inc.",
        logo: "https://via.placeholder.com/30/ef4444/ffffff?text=DS",
        location: "London",
        type: "Full-time",
        experience: "Entry Level",
        salary: "Ksh50,000 - Ksh70,000",
        description: "Assist in building and maintaining scalable RESTful APIs. Knowledge of database design and cloud services is a plus.",
        postedDate: "3 hours ago",
        isFeatured: false
    },
    {
        id: 4,
        title: "Remote Marketing Specialist",
        company: "Global Growth Co.",
        logo: "https://via.placeholder.com/30/f59e0b/ffffff?text=GG",
        location: "Remote",
        type: "Remote",
        experience: "Mid Level",
        salary: "Ksh70,000 - Ksh90,000",
        description: "Develop and execute digital marketing campaigns across multiple channels.",
        postedDate: "4 days ago",
        isFeatured: false
    }
];

// --- 2. UTILITY FUNCTIONS ---

/**
 * Gets jobs from Local Storage or returns the initial mock data.
 * @returns {Array} List of job objects.
 */
function getJobs() {
    const storedJobs = localStorage.getItem('kaziConnectJobs');
    return storedJobs ? JSON.parse(storedJobs) : initialJobs;
}

/**
 * Saves the current job list to Local Storage.
 * @param {Array} jobs - The job list to save.
 */
function saveJobs(jobs) {
    localStorage.setItem('kaziConnectJobs', JSON.stringify(jobs));
}

/**
 * Shows a custom toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - 'success', 'error', or 'warning'.
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-exclamation-triangle'}"></i><span>${message}</span>`;

    document.body.appendChild(toast);

    // Force reflow to enable transition
    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 3000);
}

// --- 3. DOM RENDERING LOGIC ---

/**
 * Creates the HTML for a single job card.
 * @param {Object} job - A single job object.
 * @returns {string} The HTML string for the job card.
 */
function createJobCardHTML(job) {
    const isFeaturedClass = job.isFeatured ? 'featured' : '';
    const date = new Date(job.expiryDate || new Date().setDate(new Date().getDate() + 30)).toLocaleDateString();

    return `
        <div class="job-card ${isFeaturedClass}" data-job-id="${job.id}">
            <div class="job-card-header">
                <span class="job-type">${job.type}</span>
                <span class="job-type">${job.experience}</span>
            </div>
            <div class="job-card-body">
                <h3 class="job-title">${job.title}</h3>
                <div class="job-company">
                    <img src="${job.logo}" alt="${job.company} Logo">
                    <span>${job.company}</span>
                </div>
                <div class="job-meta">
                    <div class="job-meta-item"><i class="fas fa-map-marker-alt"></i> ${job.location}</div>
                    <div class="job-meta-item"><i class="fas fa-money-bill-wave"></i> ${job.salary || 'Competitive'}</div>
                </div>
                <p class="job-description">${job.description}</p>
            </div>
            <div class="job-card-footer">
                <span class="job-posted">Expires: ${date}</span>
                <div class="job-actions">
                    <a href="#" class="apply-btn" data-job-id="${job.id}">Apply Now</a>
                    <div class="share-buttons">
                        <a href="#" class="share-btn" title="Share on Twitter"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renders a list of jobs to a specific container.
 * @param {Array} jobs - The list of jobs to render.
 * @param {HTMLElement} container - The DOM element to render into.
 */
function renderJobs(jobs, container) {
    container.innerHTML = ''; // Clear existing content

    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="far fa-frown"></i>
                <h3>No Jobs Found</h3>
                <p>Try adjusting your search or filter criteria. We're constantly adding new openings!</p>
            </div>
        `;
        return;
    }

    jobs.forEach(job => {
        container.insertAdjacentHTML('beforeend', createJobCardHTML(job));
    });
}

/**
 * Main function to load and display jobs on page load and after filtering.
 * @param {Array} currentJobs - The list of jobs to filter and display.
 */
function loadJobFeed(currentJobs) {
    const featuredContainer = document.getElementById('featuredJobs');
    const allJobsContainer = document.getElementById('allJobs');

    // 1. Get current filter values
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const jobTypeFilter = document.getElementById('jobTypeFilter').value;
    const experienceFilter = document.getElementById('experienceFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const salaryFilter = document.getElementById('salaryFilter').value;

    // 2. Filter the jobs
    const filteredJobs = currentJobs.filter(job => {
        // Search filter
        const matchesSearch = !searchInput ||
                              job.title.toLowerCase().includes(searchInput) ||
                              job.company.toLowerCase().includes(searchInput) ||
                              job.description.toLowerCase().includes(searchInput);

        // Type filter
        const matchesType = !jobTypeFilter || job.type === jobTypeFilter;

        // Experience filter
        const matchesExperience = !experienceFilter || job.experience === experienceFilter;

        // Location filter
        const matchesLocation = !locationFilter || job.location === locationFilter;

        // Salary filter (Simple range check - converts $X,XXX to XXXXX)
        const matchesSalary = !salaryFilter || (() => {
            const [minStr, maxStr] = salaryFilter.split('-');
            const jobSalaryText = job.salary.replace(/[^0-9]/g, ''); // Remove non-digits
            
            // Try to extract a numerical value from the job's salary string
            let jobSalaryValue = 0;
            if (jobSalaryText) {
                // If it's a range like "80000 - 100000", take the lower bound
                const parts = jobSalaryText.split(' '); 
                jobSalaryValue = parseInt(parts[0], 10);
            }

            if (salaryFilter === '150000+') {
                return jobSalaryValue >= 150000;
            }

            const min = parseInt(minStr, 10);
            const max = parseInt(maxStr, 10);

            return jobSalaryValue >= min && jobSalaryValue <= max;
        })();

        return matchesSearch && matchesType && matchesExperience && matchesLocation && matchesSalary;
    });

    // 3. Separate featured jobs
    const featuredJobs = filteredJobs.filter(job => job.isFeatured);

    // 4. Render the results
    renderJobs(featuredJobs, featuredContainer);
    renderJobs(filteredJobs, allJobsContainer);
}

// --- 4. EVENT HANDLERS ---

/**
 * Initializes all event listeners and UI state.
 */
function initApp() {
    const allJobs = getJobs();
    loadJobFeed(allJobs); // Initial load

    // 1. Dark Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    const theme = localStorage.getItem('theme');
    
    // Set initial theme
    if (theme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
    
    // 2. Mobile Menu Toggle (Simple placeholder)
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
        // In a real app, this would toggle a mobile menu visibility class
        showToast('Mobile menu toggle activated!', 'warning');
    });

    // 3. Post Job Modal
    const postJobModal = document.getElementById('postJobModal');
    const postJobBtn = document.getElementById('postJobBtn');
    const closePostJobModal = document.getElementById('closePostJobModal');

    postJobBtn.addEventListener('click', () => {
        postJobModal.classList.add('active');
    });

    closePostJobModal.addEventListener('click', () => {
        postJobModal.classList.remove('active');
    });

    postJobModal.addEventListener('click', (e) => {
        if (e.target === postJobModal) {
            postJobModal.classList.remove('active');
        }
    });

    // 4. Job Search and Filtering
    const searchForm = document.getElementById('searchForm');
    const jobTypeFilter = document.getElementById('jobTypeFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const locationFilter = document.getElementById('locationFilter');
    const salaryFilter = document.getElementById('salaryFilter');

    // Re-load the feed on any filter change
    const filterChangeHandler = () => loadJobFeed(getJobs());
    jobTypeFilter.addEventListener('change', filterChangeHandler);
    experienceFilter.addEventListener('change', filterChangeHandler);
    locationFilter.addEventListener('change', filterChangeHandler);
    salaryFilter.addEventListener('change', filterChangeHandler);

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loadJobFeed(getJobs());
    });

    // 5. Post Job Form Submission
    const jobPostForm = document.getElementById('jobPostForm');
    jobPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newJob = {
            id: Date.now(), // Use timestamp as a unique ID
            title: document.getElementById('jobTitle').value,
            company: document.getElementById('companyName').value,
            logo: document.getElementById('companyLogo').value || "https://via.placeholder.com/30/64748b/ffffff?text=Co",
            location: document.getElementById('jobLocation').value,
            salary: document.getElementById('jobSalary').value,
            type: document.getElementById('jobType').value,
            experience: document.getElementById('experienceLevel').value,
            expiryDate: document.getElementById('expiryDate').value,
            description: document.getElementById('jobDesc').value,
            postedDate: "Just now",
            isFeatured: false // New jobs are not featured by default
        };

        const currentJobs = getJobs();
        currentJobs.unshift(newJob); // Add new job to the start of the array

        saveJobs(currentJobs); // Save to local storage
        loadJobFeed(currentJobs); // Re-render job list

        showToast('Job posted successfully!', 'success');
        jobPostForm.reset();
        postJobModal.classList.remove('active');
    });

    // 6. Network Status Listener (Offline Indicator)
    function updateOnlineStatus() {
        if (navigator.onLine) {
            document.body.classList.remove('offline');
        } else {
            document.body.classList.add('offline');
            showToast('You are currently offline.', 'warning');
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); // Check on load
}

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', initApp);

// --- 5. Application Functionality (Placeholder for a future feature) ---

// Attach a listener to the allJobs container for delegated 'Apply Now' clicks
document.getElementById('allJobs').addEventListener('click', (e) => {
    if (e.target.classList.contains('apply-btn')) {
        e.preventDefault();
        const jobId = e.target.getAttribute('data-job-id');
        // This is where a separate application modal/flow would be initiated.
        showToast(`Attempting to apply for Job ID: ${jobId}`, 'success');
    }
});
