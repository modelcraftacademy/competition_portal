// Google Spreadsheet URL - Replace with your actual Google Form/Sheet URL
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/15dyhO7XIBTZNN6iH9vgLHtdB1lNUdaYc70h77013F-s/edit?usp=sharing"; // Replace with your form URL
const EDIT_SHEET_URL = "https://docs.google.com/spreadsheets/d/15dyhO7XIBTZNN6iH9vgLHtdB1lNUdaYc70h77013F-s/edit?usp=sharing"; // Replace with your sheet URL for editing

// Sample data - In production, this would come from a backend or Google Sheets API
let leaderboardData = [];

// DOM Elements
const leaderboardBody = document.getElementById('leaderboardBody');
const refreshBtn = document.getElementById('refreshBtn');
const addResultBtn = document.getElementById('addResultBtn');
const editDataBtn = document.getElementById('editDataBtn');
const notebookModal = document.getElementById('notebookModal');
const closeModal = document.querySelector('.close-modal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data (empty)
    updateLeaderboard();
    
    // Event Listeners
    refreshBtn.addEventListener('click', refreshLeaderboard);
    addResultBtn.addEventListener('click', addNewResult);
    editDataBtn.addEventListener('click', editData);
    closeModal.addEventListener('click', closeNotebookModal);
    closeModalBtn.addEventListener('click', closeNotebookModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === notebookModal) {
            closeNotebookModal();
        }
    });
});

// Function to refresh leaderboard
function refreshLeaderboard() {
    // Show loading state
    leaderboardBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center; padding: 40px;">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: #667eea;"></i>
                    <p style="margin-top: 10px;">Refreshing leaderboard...</p>
                </div>
            </td>
        </tr>
    `;
    
    // Simulate API call delay
    setTimeout(() => {
        // In a real application, you would fetch data from Google Sheets API here
        // For demo purposes, we'll use sample data
        
        // Example: Fetch from a mock API endpoint
        // fetch('your-backend-endpoint-or-google-sheets-api')
        //     .then(response => response.json())
        //     .then(data => {
        //         leaderboardData = data;
        //         updateLeaderboard();
        //     })
        //     .catch(error => {
        //         console.error('Error fetching data:', error);
        //         updateLeaderboard();
        //     });
        
        // For demo, we'll just update with current data
        updateLeaderboard();
        
        // Show success message
        showNotification('Leaderboard refreshed successfully!', 'success');
    }, 1000);
}

// Function to add new result
function addNewResult() {
    // Redirect to Google Form/Sheet for data entry
    window.open(GOOGLE_SHEET_URL, '_blank');
    showNotification('Redirecting to submission form...', 'info');
}

// Function to edit data
function editData() {
    // Redirect to Google Sheet for editing
    window.open(EDIT_SHEET_URL, '_blank');
    showNotification('Redirecting to edit spreadsheet...', 'info');
}

// Function to update leaderboard display
function updateLeaderboard() {
    // Sort data by R² score (highest to lowest)
    const sortedData = [...leaderboardData].sort((a, b) => b.score - a.score);
    
    // Update top 3 rankings
    updateTopRankings(sortedData);
    
    // Update statistics
    updateStatistics(sortedData);
    
    // Clear current table
    leaderboardBody.innerHTML = '';
    
    // Check if data is empty
    if (sortedData.length === 0) {
        leaderboardBody.innerHTML = `
            <tr class="no-data">
                <td colspan="6">
                    <div class="empty-state">
                        <i class="fas fa-chart-line"></i>
                        <h3>No Data Available</h3>
                        <p>Click "Add New Result" to submit the first entry!</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Populate table with data
    sortedData.forEach((entry, index) => {
        const rank = index + 1;
        const row = document.createElement('tr');
        
        // Add rank-based styling for top 3
        if (rank === 1) row.classList.add('rank-1');
        else if (rank === 2) row.classList.add('rank-2');
        else if (rank === 3) row.classList.add('rank-3');
        
        row.innerHTML = `
            <td>${rank}</td>
            <td>${entry.studentName}</td>
            <td>${entry.modelName}</td>
            <td class="score-cell">${entry.score.toFixed(4)}</td>
            <td>
                ${entry.notebookLink ? 
                    `<button class="notebook-btn" onclick="openNotebook('${entry.notebookLink}')">
                        <i class="fas fa-external-link-alt"></i> View Notebook
                    </button>` :
                    `<button class="notebook-btn disabled" onclick="showNoNotebookMessage()">
                        <i class="fas fa-times-circle"></i> No Notebook
                    </button>`
                }
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-warning" onclick="editEntry('${entry.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn btn-danger" onclick="deleteEntry('${entry.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        
        leaderboardBody.appendChild(row);
    });
}

// Function to update top 3 rankings display
function updateTopRankings(data) {
    const firstPlace = document.getElementById('firstName');
    const firstScore = document.getElementById('firstScore');
    const secondPlace = document.getElementById('secondName');
    const secondScore = document.getElementById('secondScore');
    const thirdPlace = document.getElementById('thirdName');
    const thirdScore = document.getElementById('thirdScore');
    
    if (data.length > 0) {
        firstPlace.textContent = data[0]?.studentName || '-';
        firstScore.textContent = data[0]?.score.toFixed(4) || '-';
    } else {
        firstPlace.textContent = '-';
        firstScore.textContent = '-';
    }
    
    if (data.length > 1) {
        secondPlace.textContent = data[1]?.studentName || '-';
        secondScore.textContent = data[1]?.score.toFixed(4) || '-';
    } else {
        secondPlace.textContent = '-';
        secondScore.textContent = '-';
    }
    
    if (data.length > 2) {
        thirdPlace.textContent = data[2]?.studentName || '-';
        thirdScore.textContent = data[2]?.score.toFixed(4) || '-';
    } else {
        thirdPlace.textContent = '-';
        thirdScore.textContent = '-';
    }
}

// Function to update statistics
function updateStatistics(data) {
    const totalStudents = document.getElementById('totalStudents');
    const totalModels = document.getElementById('totalModels');
    const avgScore = document.getElementById('avgScore');
    const bestScore = document.getElementById('bestScore');
    
    totalStudents.textContent = data.length;
    totalModels.textContent = data.length;
    
    if (data.length > 0) {
        const average = data.reduce((sum, entry) => sum + entry.score, 0) / data.length;
        avgScore.textContent = average.toFixed(4);
        bestScore.textContent = Math.max(...data.map(entry => entry.score)).toFixed(4);
    } else {
        avgScore.textContent = '0.0000';
        bestScore.textContent = '0.0000';
    }
}

// Function to open notebook link
function openNotebook(url) {
    window.open(url, '_blank');
}

// Function to show no notebook message
function showNoNotebookMessage() {
    notebookModal.style.display = 'block';
}

// Function to close notebook modal
function closeNotebookModal() {
    notebookModal.style.display = 'none';
}

// Function to edit an entry
function editEntry(id) {
    // In a real application, this would redirect to a specific edit form or sheet
    // For now, we'll redirect to the general edit sheet
    window.open(EDIT_SHEET_URL, '_blank');
    showNotification('Redirecting to edit entry...', 'info');
}

// Function to delete an entry
function deleteEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        // In a real application, you would make an API call to delete the entry
        // For demo purposes, we'll filter it out from the local data
        leaderboardData = leaderboardData.filter(entry => entry.id !== id);
        updateLeaderboard();
        showNotification('Entry deleted successfully!', 'success');
    }
}

// Function to show notifications
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add styles for notification content
    const contentStyle = document.createElement('style');
    contentStyle.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: 15px;
        }
    `;
    document.head.appendChild(contentStyle);
    
    document.body.appendChild(notification);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// For demo purposes - Adding sample data
// In a real application, this data would come from your Google Sheets
// To add your actual data, replace the sampleData array with your data
const sampleData = [
    // {
    //     id: '1',
    //     studentName: 'Al Hossain',
    //     modelName: 'Linear Regression',
    //     score: 0.679,
    //     notebookLink: 'https://github.com/alhossainn/machine_learning_to_deep_learning/blob/main/linear-regression-v3.ipynb'
    // },

    // {
    //     id: '2',
    //     studentName: 'Tansin Tabassum Alvi',
    //     modelName: 'Linear Regression',
    //     score: 0.683,
    //     notebookLink: 'https://github.com/TansinTabassum/deep_learning/blob/main/linear-regression.ipynb'
    // },

    // {
    //     id: '3',
    //     studentName: 'Asif Ahmed',
    //     modelName: 'Linear Regression',
    //     score: 0.723,
    //     notebookLink: 'https://github.com/ImAs-If/housing-price-analysis-linear-regression'
    // },

    // {
    //     id: '4',
    //     studentName: 'Ayon Adhikary',
    //     modelName: 'Linear Regression',
    //     score: 0.778,
    //     notebookLink: 'https://github.com/theayon7/house_price_testing_linear_regression'
    // },

    // {
    //     id: '5',
    //     studentName: 'Sristy Naha',
    //     modelName: 'Linear Regression',
    //     score: 0.828,
    //     notebookLink: 'https://github.com/nahashanghita-srs/house-price-linear-regression'
    // }
];

// Uncomment the line below to use sample data for testing
leaderboardData = sampleData;
updateLeaderboard();

// Initialize with sample data for demo (comment this out in production)
// setTimeout(() => {
//     // leaderboardData = sampleData; // Uncomment to see sample data
//     // updateLeaderboard(); // Uncomment to see sample data

// }, 1000);









