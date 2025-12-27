// admin/js/app.js
import { supabase } from '../../assets/js/supabase-config.js'; 

console.log("App.js loaded successfully!"); // DEBUG 1

// DOM Elements
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const createAnnForm = document.getElementById('create-announcement-form');
const logoutBtn = document.getElementById('logout-btn');

// ================= AUTHENTICATION =================
async function checkUser() {
    console.log("Checking user session..."); // DEBUG 2
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error("Session Check Error:", error);
            return;
        }

        if (session) {
            console.log("User found:", session.user.email); // DEBUG 3
            loginView.style.display = 'none';
            dashboardView.style.display = 'flex';
            loadAnnouncements();
        } else {
            console.log("No user logged in."); // DEBUG 3
            loginView.style.display = 'flex';
            dashboardView.style.display = 'none';
        }
    } catch (err) {
        console.error("Critical Auth Error:", err);
    }
}

// Check on load
checkUser();

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth State Changed:", event); // DEBUG 4
    checkUser();
});

// Login Function
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // This stops the page from reloading
    console.log("Login button clicked"); // DEBUG 5

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');
    
    errorMsg.textContent = "Logging in...";

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        console.error("Login Failed:", error); // DEBUG 6
        errorMsg.textContent = "Error: " + error.message;
    } else {
        console.log("Login Successful!"); // DEBUG 6
        errorMsg.textContent = "Success! Redirecting...";
        // onAuthStateChange will handle the switch
    }
});

// Logout Function
logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Force reload to clear state
});

// ... (Keep your Announcement Code below here) ...
// ================= ANNOUNCEMENTS CRUD =================

// 1. Create Announcement
createAnnForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newAnn = {
        title: document.getElementById('ann-title').value,
        description: document.getElementById('ann-desc').value,
        type: document.getElementById('ann-type').value,
        category: document.getElementById('ann-category').value,
        meta: document.getElementById('ann-meta').value,
        image: document.getElementById('ann-image').value
    };

    try {
        const { error } = await supabase
            .from('announcements')
            .insert([newAnn]);

        if (error) throw error;

        alert("Announcement Published!");
        document.getElementById('add-announcement-modal').style.display = 'none';
        createAnnForm.reset();
        loadAnnouncements(); // Refresh list

    } catch (error) {
        alert("Error adding announcement: " + error.message);
    }
});

// 2. Read & List Announcements
async function loadAnnouncements() {
    const list = document.getElementById('admin-announcements-list');
    list.innerHTML = '<p>Loading...</p>';

    const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        list.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
        return;
    }

    if (!data || data.length === 0) {
        list.innerHTML = '<p>No announcements found.</p>';
        return;
    }

    list.innerHTML = ''; // Clear loading

    data.forEach((item) => {
        // Fallback image for admin view
        const imgUrl = item.image || 'https://via.placeholder.com/300x150?text=No+Image';

        const card = `
            <div class="admin-card">
                <img src="${imgUrl}" alt="img">
                <div class="admin-card-body">
                    <h4>${item.title}</h4>
                    <p style="font-size:0.8rem; color:#666;">${item.category} | ${item.meta}</p>
                </div>
                <div class="admin-card-actions">
                    <button class="btn-delete" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `;
        list.innerHTML += card;
    });

    // Attach Delete Events
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', deleteAnnouncement);
    });
}

// 3. Delete Announcement
async function deleteAnnouncement(e) {
    if(!confirm("Are you sure you want to delete this?")) return;
    
    const id = e.target.getAttribute('data-id');
    
    const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

    if (error) {
        alert("Error deleting: " + error.message);
    } else {
        loadAnnouncements();
    }
}