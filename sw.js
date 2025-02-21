self.addEventListener('install', event => {
    self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim()); // Take control of the page
});

// Check for incomplete tasks daily
self.addEventListener('periodicsync', event => {
    if (event.tag === 'task-reminder') {
        event.waitUntil(checkTasks());
    }
});

async function checkTasks() {
    const today = new Date().toDateString();
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '{}')[today] || [];

    if (completedTasks.length < 3) {
        const notificationOptions = {
            body: `You have ${3 - completedTasks.length} task(s) left today!`,
            icon: 'https://via.placeholder.com/192', // Replace with your icon
            vibrate: [200, 100, 200]
        };

        self.registration.showNotification('Daily Micro-Task Reminder', notificationOptions);
    }
}

// Simulate periodic sync (for testing, since PeriodicSync isn’t widely supported yet)
setInterval(() => checkTasks(), 24 * 60 * 60 * 1000); // Check daily