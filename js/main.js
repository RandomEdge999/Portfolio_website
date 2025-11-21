const projectsData = [
    { id: "hand_ai", name: "Hand Reading AI", type: "AI", stack: "Python, TF Lite, OpenCV", link: "https://github.com/RandomEdge999/hand-reading-ai", desc: "Real-time gesture recognition engine optimized for edge devices using TensorFlow Lite and OpenCV." },
    { id: "city_pulse", name: "City Pulse", type: "DATA", stack: "FastAPI, TimescaleDB", link: "https://github.com/RandomEdge999/City-Pulse", desc: "High-throughput urban analytics platform ingesting social streams for anomaly detection." },
    { id: "teacher_eval", name: "Teacher Eval Sys", type: "WEB", stack: "Next.js, Postgres", link: "https://github.com/RandomEdge999/Teacher-Evaluation-System", desc: "SaaS platform for educator assessment featuring role-based access and live reporting." },
    { id: "soccer_ai", name: "Soccer Predictor", type: "AI", stack: "Scikit-learn, Flask", link: "https://github.com/RandomEdge999/Soccer-Predictor-Pro", desc: "End-to-end ML pipeline scraping fixtures and calibrating match outcome probabilities." },
    { id: "ai_social", name: "AI Social Mirror", type: "AI", stack: "HuggingFace, Stripe", link: "https://github.com/RandomEdge999/ai-social-mirror", desc: "Sentiment analysis SaaS decoding social media tone and intent using Transformers." },
    { id: "rhok_sat", name: "RHOK-SAT", type: "DATA", stack: "Python, Plotly", link: null, desc: "Telemetry dashboard for CubeSat ground station with 99.9% logging uptime." },
    { id: "git_cli", name: "Git Client", type: "WEB", stack: "Python", link: "https://github.com/RandomEdge999/Git-Client", desc: "Lightweight recreation of Git core features in pure Python." },
    { id: "vr_game", name: "VR Escape", type: "WEB", stack: "Unity, C#", link: null, desc: "Immersive VR puzzle experience optimized for Oculus Quest." },
    { id: "cancer_detect", name: "Cancer Detect", type: "AI", stack: "Python, OpenCV", link: null, desc: "Biomedical imaging algorithm for detecting cellular anomalies." }
];

const aboutContent = `
NAME: Muhammad Aleem Azhar
CLASS: AI Engineer / Data Scientist
BASE: Memphis, TN

[ BIO_DATA ]
Computer Science Senior at Rhodes College (2026).
Alumnus of Yonsei University, Seoul (AI & Vision).

[ DIRECTIVES ]
1. Construct noise-resilient AI systems (GANs).
2. Engineer scalable backend architectures.
3. Solve complex data problems.

[ SKILL_MATRIX ]
> LANGUAGES: Python (Expert), C++, JS/TS, SQL
> AI CORE: PyTorch, TensorFlow, OpenCV, HuggingFace
> INFRA: Docker, Kubernetes, AWS, Linux
> WEB: FastAPI, Next.js, React
`;

const bootLines = [
    "Initializing AleemOS Kernel v5.3...",
    "Loading Neural Interfaces... [OK]",
    "Mounting /dev/sda1... [OK]",
    "Starting Cybersec Daemons... [OK]",
    "Establishing Uplink... [CONNECTED]",
    "Welcome, Admin."
];

let bootSkipped = false;

async function boot() {
    const log = document.getElementById('boot-log');
    for (const line of bootLines) {
        if (bootSkipped) break;
        const p = document.createElement('p');
        p.innerText = `> ${line}`;
        log.appendChild(p);
        await new Promise((resolve) => setTimeout(resolve, 150));
    }
    if (!bootSkipped) await new Promise((resolve) => setTimeout(resolve, 500));
    attemptLogin();
}

function attemptLogin() {
    bootSkipped = true;
    document.getElementById('boot-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');

    setTimeout(() => {
        const input = document.getElementById('login-pass');
        const pass = "********";
        let i = 0;
        const interval = setInterval(() => {
            if (input.value.length >= pass.length) {
                clearInterval(interval);
                setTimeout(loginSuccess, 300);
            } else {
                input.value += pass[i];
                i++;
            }
        }, 100);
    }, 500);
}

function loginSuccess() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    document.getElementById('taskbar').classList.remove('hidden');
    document.getElementById('taskbar').classList.add('flex');

    printWelcome();
    startLogs();
    startClock();
    updateTaskbarWindows();
    document.getElementById('cmd').focus();
}

const output = document.getElementById('term-output');
const cmdInput = document.getElementById('cmd');

function print(html) {
    const div = document.createElement('div');
    div.className = 'mb-1';
    div.innerHTML = html;
    output.appendChild(div);
    output.parentElement.scrollTop = output.parentElement.scrollHeight;
}

function printWelcome() {
    print('<span class="text-cyber-primary font-bold">AleemOS v5.3</span> <span class="text-gray-500">System Ready.</span>');
    print("<span class='text-gray-400'>Type <span class='text-white'>'help'</span> for command list.</span><br>");
}

cmdInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const val = cmdInput.value.trim();
        if (val) {
            print(`<span class="text-cyber-primary">➜</span> <span class="text-white">${val}</span>`);
            processCmd(val);
        }
        cmdInput.value = '';
    }
});

function processCmd(raw) {
    const args = raw.split(' ');
    const cmd = args[0].toLowerCase();
    const arg = args[1];

    switch (cmd) {
        case 'help':
            print(`<div class="grid grid-cols-2 gap-4 text-xs text-cyber-secondary mt-2 mb-2">
                <span>ls</span><span>List directory</span>
                <span>cat [file]</span><span>Read file</span>
                <span>open [file]</span><span>Open Window</span>
                <span>projects</span><span>Launch GUI</span>
                <span>repo [name]</span><span>Open GitHub</span>
                <span>clear</span><span>Clear terminal</span>
            </div>`);
            break;
        case 'clear':
            output.innerHTML = '';
            break;
        case 'ls':
            print('<span class="text-cyber-secondary">about.txt  projects/  skills.md  contact.info</span>');
            break;
        case 'cat':
            if (arg === 'about.txt') {
                print(`<pre class="text-gray-300 text-xs font-mono">${aboutContent}</pre>`);
            } else if (arg === 'skills.md') {
                print("<span class='text-gray-300'>ACCESS VIA 'open skills' FOR BETTER VIEW.</span>");
            } else {
                print('File not found.');
            }
            break;
        case 'projects':
            spawnWindow('projects');
            break;
        case 'lab':
            spawnWindow('lab');
            break;
        case 'open':
            spawnWindow(arg);
            break;
        case 'repo': {
            const proj = projectsData.find((p) => p.id === arg || p.name.toLowerCase().includes(arg));
            if (proj && proj.link) window.open(proj.link, '_blank');
            else print('Repo not found.');
            break;
        }
        default:
            print(`Command not found: ${cmd}`);
    }
}

let zIndex = 100;
let dragItem = null;
let startX;
let startY;
let initLeft;
let initTop;

function spawnWindow(type) {
    let winId = '';
    if (type === 'terminal') winId = 'win-term';
    else if (type === 'projects') {
        renderProjects();
        winId = 'win-projects';
    } else if (type === 'about' || type === 'about.txt') {
        openFileViewer('ABOUT.TXT', aboutContent);
        return;
    } else if (type === 'lab') {
        startHtop();
        winId = 'win-htop';
    }

    if (winId) openWin(winId);
}

function openFileViewer(title, content) {
    const win = document.getElementById('win-file');
    document.getElementById('file-title').innerText = title;
    document.getElementById('file-content').innerHTML = `<pre class="whitespace-pre-wrap">${content}</pre>`;
    openWin('win-file');
}

function openWin(id) {
    const el = document.getElementById(id);
    el.style.display = 'flex';
    setTimeout(() => {
        el.classList.add('open');
        el.classList.remove('minimized');
        bringToFront(id);
    }, 10);
    updateTaskbarWindows();
}

function closeWin(id) {
    const el = document.getElementById(id);
    el.classList.remove('open');
    setTimeout(() => {
        el.style.display = 'none';
    }, 200);
    updateTaskbarWindows();
}

function minimize(id) {
    document.getElementById(id).classList.add('minimized');
    updateTaskbarWindows();
}

function maximize(id) {
    const el = document.getElementById(id);
    if (el.style.width === '100%') {
        el.style.width = '800px';
        el.style.height = '500px';
        el.style.top = '100px';
        el.style.left = '100px';
    } else {
        el.style.width = '100%';
        el.style.height = 'calc(100% - 48px)';
        el.style.top = '48px';
        el.style.left = '0';
    }
}

function bringToFront(id) {
    zIndex++;
    document.querySelectorAll('.window').forEach((w) => w.classList.remove('active'));
    const el = document.getElementById(id);
    el.style.zIndex = zIndex;
    el.classList.add('active');
    updateTaskbarWindows();
}

function renderProjects(filter = 'ALL') {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '';
    projectsData.forEach((proj) => {
        if (filter !== 'ALL' && !proj.type.includes(filter)) return;

        const card = document.createElement('div');
        card.className = 'bg-black border border-white/10 p-4 hover:border-cyber-primary transition-colors group cursor-pointer relative overflow-hidden';
        card.innerHTML = `
            <div class="absolute top-0 right-0 bg-white/10 text-[9px] px-1 text-white uppercase">${proj.type}</div>
            <h3 class="text-cyber-primary font-bold text-lg mb-1 group-hover:text-white">${proj.name}</h3>
            <div class="text-[10px] text-cyber-secondary mb-3 font-bold tracking-wider">${proj.stack}</div>
            <p class="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">${proj.desc}</p>
            <div class="flex items-center gap-2 text-xs text-cyber-primary group-hover:underline mt-auto">
                <i class="fas fa-info-circle"></i> VIEW DETAILS
            </div>
        `;
        card.onclick = () => {
            openProjectDetails(proj);
        };
        grid.appendChild(card);
    });
}

function filterProjects(category, btn) {
    document.querySelectorAll('.category-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(category);
}

function openProjectDetails(project) {
    const detailContent = `
PROJECT: ${project.name}
TYPE: ${project.type}
STACK: ${project.stack}

[ DESCRIPTION ]
${project.desc}

[ TECH BREAKDOWN ]
- Architecture: Microservices / Monolith
- Database: Normalized Schema
- Optimization: High-throughput / Low-latency

${project.link ? `[ ACCESS ]\nREPO LINK: ${project.link}\n(Click 'OPEN REPO' in terminal or copy link)` : `[ ACCESS ]\nSTATUS: PRIVATE / CLASSIFIED`}
`;
    openFileViewer(project.name.toUpperCase(), detailContent);
}

function toggleStartMenu() {
    document.getElementById('start-menu').classList.toggle('hidden');
}

document.addEventListener('click', (event) => {
    const menu = document.getElementById('start-menu');
    const btn = document.querySelector('button[onclick="toggleStartMenu()"]');
    if (!menu.classList.contains('hidden') && !menu.contains(event.target) && !btn.contains(event.target)) {
        menu.classList.add('hidden');
    }
});

function updateTaskbarWindows() {
    const container = document.getElementById('taskbar-apps');
    container.innerHTML = '';
    const wins = document.querySelectorAll('.window');
    wins.forEach((win) => {
        if (win.style.display !== 'none') {
            const title = win.querySelector('.title-bar span').innerText;
            const btn = document.createElement('div');
            const isActive = win.classList.contains('active') && !win.classList.contains('minimized');
            btn.className = `h-8 px-3 flex items-center justify-center border border-white/10 text-xs cursor-pointer transition-all ${isActive ? 'bg-cyber-primary text-black border-cyber-primary' : 'bg-black/50 text-gray-400 hover:text-white hover:border-white/30'}`;
            btn.innerText = title.length > 10 ? `${title.substr(0, 10)}...` : title;
            btn.onclick = () => {
                if (win.classList.contains('minimized')) {
                    win.classList.remove('minimized');
                    bringToFront(win.id);
                } else if (win.classList.contains('active')) {
                    minimize(win.id);
                } else {
                    bringToFront(win.id);
                }
            };
            container.appendChild(btn);
        }
    });
}

function dragStart(event, id) {
    bringToFront(id);
    dragItem = document.getElementById(id);
    startX = event.clientX;
    startY = event.clientY;
    const rect = dragItem.getBoundingClientRect();
    initLeft = rect.left;
    initTop = rect.top;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
}

function drag(event) {
    if (!dragItem) return;
    dragItem.style.left = `${initLeft + (event.clientX - startX)}px`;
    dragItem.style.top = `${initTop + (event.clientY - startY)}px`;
}

function dragEnd() {
    dragItem = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
}

function startClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('top-clock').innerText = now.toLocaleTimeString();
        document.getElementById('clock-bottom').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
}

function startHtop() {
    const el = document.getElementById('htop-content');
    if (el.innerText !== '') return;
    setInterval(() => {
        if (document.getElementById('win-htop').style.display === 'none') return;
        let html = "<div class='flex justify-between mb-2 border-b border-white/10 pb-1'><span>PID USER PRI VIRT CPU% MEM% COMMAND</span></div>";
        for (let i = 0; i < 12; i++) {
            html += `<div class="flex justify-between text-gray-400 text-[10px]"><span>${1000 + i} root  20  ${Math.floor(Math.random() * 500)}M ${(Math.random() * 5).toFixed(1)}  ${(Math.random() * 2).toFixed(1)}  process_${i}</span></div>`;
        }
        el.innerHTML = html;
    }, 1000);
}

function startLogs() {
    const logs = [
        'Analyzing neural pathways...',
        'Optimizing GAN weights...',
        'Compiling TypeScript modules...',
        'Deploying to Edge Network...',
        'Fetching GitHub repositories...',
        'System health: 100%',
        'Intrusion detection active.'
    ];
    const container = document.getElementById('activity-log');
    let i = 0;
    setInterval(() => {
        const p = document.createElement('div');
        p.innerText = `> ${logs[i % logs.length]} [${Math.floor(Math.random() * 100)}ms]`;
        container.prepend(p);
        if (container.children.length > 10) container.lastChild.remove();
        i++;
    }, 2000);
}

window.onload = boot;
