/* data.js
   Each team has id, name, color (optional), leaderId, members array (member IDs).
   Each person has id, name, role, avatar (avatars/xxx.png), groupId.
   Edit this file to update the chart. Keep IDs unique.
*/

/* =========================================================
   TEAMS
   ---------------------------------------------------------
   - Describes WHAT the teams are
   - No members listed here
   - leaderId points to a person in PEOPLE
   ========================================================= */

const TEAMS = [
  {
    id: "team-core",
    name: "Core Officers",
    color: "#e6b800",
    leaderId: "u1" // A Cat Called Peony
  },
  {
    id: "team-art",
    name: "Creative / Art",
    color: "#e63946",
    leaderId: "u3" // TT Sushi
  },
  {
    id: "team-race",
    name: "Racing",
    color: "#4da6ff",
    leaderId: "u2" // Smirks
  }
];


/* =========================================================
   PEOPLE
   ---------------------------------------------------------
   - Each person exists ONCE
   - No roles here (roles change per team)
   - Avatars and bios stay consistent everywhere
   ========================================================= */

const PEOPLE = [
  {
    id: "u1",
    name: "A Cat Called Peony",
    avatar: "../avatar/hierarchytc.webp",
    bio: "Founder and overall team leader."
  },
  {
    id: "u2",
    name: "Smirks",
    avatar: "../avatar/hierarchyoff.webp",
    bio: "Core officer and racing strategist."
  },
  {
    id: "u3",
    name: "TT Sushi",
    avatar: "../avatar/hierarchyoff.webp",
    bio: "Core officer and creative director."
  },
  {
    id: "u5",
    name: "SprayOne",
    avatar: "avatars/spray1.png",
    bio: "Street and digital art."
  },
  {
    id: "u6",
    name: "Stencil12",
    avatar: "avatars/stencil12.png",
    bio: "Design systems."
  },
  {
    id: "u7",
    name: "NewOfficer",
    avatar: "avatars/newofficer.png",
    bio: "Up-and-coming artist."
  },
  {
    id: "u8",
    name: "Speedy",
    avatar: "avatars/speedy.png",
    bio: "Competitive racer."
  },
  {
    id: "u9",
    name: "NitroKid",
    avatar: "avatars/nitrokid.png",
    bio: "Daily racer."
  }
];


/* =========================================================
   MEMBERSHIPS  (MOST IMPORTANT PART)
   ---------------------------------------------------------
   - This defines WHO is in WHICH TEAM
   - And WHAT ROLE they have in THAT team
   - Same person can appear multiple times
   ========================================================= */

const MEMBERSHIPS = [
  /* ---------- Core Officers ---------- */
  {
    personId: "u1",
    teamId: "team-core",
    role: "Team Leader"
  },
  {
    personId: "u2",
    teamId: "team-core",
    role: "Officer"
  },
  {
    personId: "u3",
    teamId: "team-core",
    role: "Officer"
  },

  /* ---------- Creative / Art ---------- */
  {
    personId: "u3",
    teamId: "team-art",
    role: "Art Lead" // TT Sushi leads Art
  },
  {
    personId: "u5",
    teamId: "team-art",
    role: "Artist"
  },
  {
    personId: "u6",
    teamId: "team-art",
    role: "Artist"
  },
  {
    personId: "u7",
    teamId: "team-art",
    role: "Junior Artist"
  },

  /* ---------- Racing ---------- */
  {
    personId: "u2",
    teamId: "team-race",
    role: "Race Captain" // Smirks leads Racing
  },
  {
    personId: "u8",
    teamId: "team-race",
    role: "Racer"
  },
  {
    personId: "u9",
    teamId: "team-race",
    role: "Racer"
  }
];


/* ------------ rendering logic below (do not edit unless you know JS) ------------- */

(function(){
  const orgRoot = document.getElementById('orgChart');
  const groupFilter = document.getElementById('groupFilter');
  const searchInput = document.getElementById('searchInput');
  const expandAllBtn = document.getElementById('expandAll');
  const collapseAllBtn = document.getElementById('collapseAll');
  const modal = document.getElementById('memberModal');
  const modalContent = document.getElementById('modalContent');
  const closeModal = document.getElementById('closeModal');

  // Utility lookups
  const peopleById = {};
  PEOPLE.forEach(p => peopleById[p.id] = p);

  // populate filter
  TEAMS.forEach(t=>{
    const opt = document.createElement('option');
    opt.value = t.id; opt.textContent = t.name;
    groupFilter.appendChild(opt);
  });

  function buildChart(filterGroupId = '', searchTerm = '') {
    orgRoot.innerHTML = '';
    const term = searchTerm.trim().toLowerCase();

    TEAMS.forEach(team => {
      if (filterGroupId && team.id !== filterGroupId) return;

      // create team container
      const teamEl = document.createElement('div');
      teamEl.className = 'team';
      teamEl.dataset.teamId = team.id;

      // header
      const header = document.createElement('div');
      header.className = 'team-header';
      header.innerHTML = `<div>
        <div class="team-title">${team.name}</div>
        <div class="team-meta">Leader: ${peopleById[team.leaderId] ? peopleById[team.leaderId].name : '—'}</div>
      </div>
      <div class="team-toggle">▾</div>`;
      teamEl.appendChild(header);

      // member grid
      const memberGrid = document.createElement('div');
      memberGrid.className = 'member-list';

      // collect visible members
      const members = (team.members || []).map(id => peopleById[id]).filter(Boolean);
      const visible = members.filter(p=>{
        if(!term) return true;
        return p.name.toLowerCase().includes(term) || p.role.toLowerCase().includes(term);
      });

      visible.forEach(p=>{
        const m = document.createElement('div');
        m.className = 'member';
        m.dataset.personId = p.id;
        m.innerHTML = `
          <img class="avatar" src="${p.avatar}" alt="${p.name}">
          <div class="member-info">
            <div class="name">${p.name} ${team.leaderId === p.id ? '<span class="badge leader-badge">LEADER</span>':''}</div>
            <div class="role">${p.role} <span class="small">• ${team.name}</span></div>
          </div>
        `;
        m.addEventListener('click', ()=> openMemberModal(p, team));
        memberGrid.appendChild(m);
      });

      teamEl.appendChild(memberGrid);
      // collapsed state if no match
      if (visible.length === 0) teamEl.classList.add('collapsed');

      // clickable header to toggle
      header.addEventListener('click', ()=>{
        teamEl.classList.toggle('collapsed');
        const toggle = header.querySelector('.team-toggle');
        toggle.textContent = teamEl.classList.contains('collapsed') ? '▸' : '▾';
      });

      orgRoot.appendChild(teamEl);
    });
  }

  function openMemberModal(person, team){
    modal.setAttribute('aria-hidden','false');
    modalContent.innerHTML = `
      <div class="modal-inner-content">
        <div class="modal-body">
          <img src="${person.avatar}" alt="${person.name}">
          <div class="meta">
            <h3>${person.name}</h3>
            <p class="small">${person.role} • ${team.name}</p>
            <p>${person.bio || ''}</p>
            <p class="small">ID: ${person.id}</p>
          </div>
        </div>
      </div>
    `;
  }
  closeModal.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
  modal.addEventListener('click', (e)=> { if(e.target === modal) modal.setAttribute('aria-hidden','true') });

  // search / filter handlers
  searchInput.addEventListener('input', ()=> buildChart(groupFilter.value, searchInput.value));
  groupFilter.addEventListener('change', ()=> buildChart(groupFilter.value, searchInput.value));
  expandAllBtn.addEventListener('click', ()=> {
    document.querySelectorAll('.team').forEach(t=> t.classList.remove('collapsed'));
    document.querySelectorAll('.team-toggle').forEach(el=> el.textContent='▾');
  });
  collapseAllBtn.addEventListener('click', ()=> {
    document.querySelectorAll('.team').forEach(t=> t.classList.add('collapsed'));
    document.querySelectorAll('.team-toggle').forEach(el=> el.textContent='▸');
  });

  // initial render
  buildChart();

})();
