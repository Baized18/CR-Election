import { 
    auth, 
    provider, 
    db, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged, 
    ref, 
    set, 
    get, 
    child 
} from "./firebase.js";

// Student Data List
const female = [
  { name: "Tasmia Mahi Diha",       id: "20245103174" },
  { name: "Afia Basher Subah",      id: "20245103182" },
  { name: "Nowshin Ashrafi",        id: "20245103166", group: "Group 2" },
  { name: "Sanjana Zarin",          id: "20245103169", group: "Group 3" },
  { name: "Khadija Akter Rini",      id: "20245103006", group: "Group 4" },
  { name: "Arpita Sannamat",        id: "20245103026", group: "Group 4" },
  { name: "Faiza Binth Abdullah",   id: "20245103185", group: "Group 4" },
  { name: "Tahia Nazim Ahona",      id: "20245103192", group: "Group 4" },
  { name: "Monika Rani Siddha",     id: "20245103195", group: "Group 5" },
  { name: "Mst. Shoromita Sultana Mim", id: "20245103171", group: "Group 5" },
  { name: "Mashrutut Jahan Tinni",  id: "20245103204", group: "Group 5" },
  { name: "Trima Pal",              id: "20245103165", group: "Group 5" },
  { name: "Maharun Akter Rima",     id: "22235103584", group: "Group 5" },
  { name: "Mithila Yeasmin Mitu",   id: "22235103548", group: "Group 5" },
  { name: "Dolon",                  id: "20245103004", group: "Group 6" },
  { name: "Sadia Aktar",            id: "20245103191", group: "Group 7" },
  { name: "Feroza Akter Eti",       id: "20245103179", group: "Group 7" },
  { name: "Umme Tasni",             id: "20245103180", group: "Group 7" },
  { name: "Mst. Jannatul Ferdous Omi", id: "20245103105", group: "Group 8" },
  { name: "Eisrat Jahan Eisita",    id: "20245103089", group: "Group 8" }
];

const male = [
  { name: "Rashed Ahmed Hridoy",    id: "20245103289", group: "Group 1" },
  { name: "Md Rifat Hossen",        id: "20245103284", group: "Group 1" },
  { name: "Mahdi Alam",             id: "20245103101", group: "Group 1" },
  { name: "Md Anikuzzaman Rabbi",   id: "20245103085", group: "Group 1" },
  { name: "Abrar Ahmed Chowdhury",  id: "20234103334", group: "Group 1" },
  { name: "Shahedul Islam Redwan",  id: "20245103189", group: "Group 2" },
  { name: "Md Shirajul Islam",      id: "20245103198", group: "Group 3" },
  { name: "Nafiul Islam Khan",      id: "20245103170", group: "Group 3" },
  { name: "Md Sad Ullah",            id: "20245103163", group: "Group 3" },
  { name: "Sheikh Mohammad Mashrafi", id: "20245103440", group: "Group 4" },
  { name: "Md Sajidul Islam",       id: "20245103199", group: "Group 6" },
  { name: "Fahim Sariyar Shovon",   id: "20245103173", group: "Group 6" },
  { name: "Ashfaq Labib",           id: "20245103164", group: "Group 6" },
  { name: "Md. M.A. Nafi",          id: "20245103114", group: "Group 8" },
  { name: "MD. Abdul Azim",         id: "20245103086", group: "Group 8" },
  { name: "Md. Adnan Ifad Niloy",   id: "20245103280", group: "Group 8" },
  { name: "Md. Mashiur Rahman",     id: "20245103175", group: "Group 9" },
  { name: "Samiul Huda Jisan",      id: "20245103176", group: "Group 9" },
  { name: "Tahsin Ahammed Alvi",    id: "20245103187", group: "Group 9" },
  { name: "Md. Akif uz Zamman",     id: "20245103190", group: "Group 9" },
  { name: "Baized Al Basher",       id: "20245103197", group: "Group 9" },
  { name: "Farhan Mahim",           id: "20245103188", group: "Group 10" },
  { name: "K.M. Talha Jubair",      id: "20245103385", group: "Group 10" },
  { name: "S M Ahnaf Shahriar",     id: "20245103109", group: "Group 10" }
];

let selectedFemale = null;
let selectedMale = null;
let currentUser = null;

// DOM Elements
const loginBtn = document.getElementById("google-login-btn");
const logoutBtn = document.getElementById("logout-btn");
const submitBtn = document.getElementById("submit-btn");

// Login Event
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        signInWithPopup(auth, provider).catch(err => alert("Login Error: " + err.message));
    });
}

// Logout Event
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => signOut(auth));
}

// Auth State Observer
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('signin-section').style.display = 'none';
        document.getElementById('user-pill').style.display = 'flex';
        document.getElementById('user-avatar').src = user.photoURL;
        document.getElementById('user-name').textContent = user.displayName.split(' ')[0];

        // Check if user already voted in Database
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `votes/${user.uid}`));
        if (snapshot.exists()) {
            const v = snapshot.val();
            showSuccess(v.female, v.male);
        } else {
            document.getElementById('app').style.display = 'block';
            document.getElementById('submit-bar').style.display = 'flex';
        }
    } else {
        currentUser = null;
        document.getElementById('signin-section').style.display = 'flex';
        document.getElementById('user-pill').style.display = 'none';
        document.getElementById('app').style.display = 'none';
        document.getElementById('submit-bar').style.display = 'none';
    }
});

// Render Candidates
function renderCards(list, containerId, gender) {
    const grid = document.getElementById(containerId);
    grid.innerHTML = "";
    list.forEach(c => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.dataset.id = c.id;
        card.innerHTML = `
            <div class="check">✓</div>
            <div class="candidate-name">${c.name}</div>
            <div class="candidate-id">${c.id}</div>
        `;
        card.onclick = () => selectCandidate(card, c, gender);
        grid.appendChild(card);
    });
}

function selectCandidate(card, candidate, gender) {
    const grid = document.getElementById(gender === 'female' ? 'female-grid' : 'male-grid');
    grid.querySelectorAll('.candidate-card').forEach(c => {
        c.classList.remove(`selected-${gender}`);
    });
    card.classList.add(`selected-${gender}`);

    if (gender === 'female') {
        selectedFemale = candidate;
        document.getElementById('sel-female').textContent = candidate.name.split(' ')[0];
    } else {
        selectedMale = candidate;
        document.getElementById('sel-male').textContent = candidate.name.split(' ')[0];
    }

    submitBtn.disabled = !(selectedFemale && selectedMale);
}

// Submit Vote to Firebase Database
submitBtn.addEventListener("click", async () => {
    if (!selectedFemale || !selectedMale || !currentUser) return;
    
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
        await set(ref(db, `votes/${currentUser.uid}`), {
            voterEmail: currentUser.email,
            voterName: currentUser.displayName,
            female: selectedFemale,
            male: selectedMale,
            timestamp: new Date().toISOString()
        });
        showSuccess(selectedFemale, selectedMale);
    } catch (err) {
        alert("Submission Failed: " + err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Vote →";
    }
});

function showSuccess(f, m) {
    document.getElementById('app').style.display = 'none';
    document.getElementById('submit-bar').style.display = 'none';
    document.getElementById('success-overlay').style.display = 'flex';
    document.getElementById('success-detail').innerHTML = `
        <div>🎀 Female CR vote: <strong>${f.name}</strong> <span style="color:var(--muted);font-size:.8rem">(${f.id})</span></div>
        <div>💙 Male CR vote: <strong>${m.name}</strong> <span style="color:var(--muted);font-size:.8rem">(${m.id})</span></div>
    `;
}

// Init
renderCards(female, 'female-grid', 'female');
renderCards(male, 'male-grid', 'male');